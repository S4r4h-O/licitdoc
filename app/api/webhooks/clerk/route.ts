import { createCompanyDefaultValues } from "@/lib/contants/defaultValues";
import { prisma } from "@/prisma/client";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);
    const eventType = evt.type;

    console.log(
      `Received webhook with ID ${evt.data.id} and event type of ${eventType}`,
    );

    switch (eventType) {
      case "user.created": {
        const {
          id: clerkId,
          email_addresses,
          first_name,
          last_name,
        } = evt.data;
        const email = email_addresses[0].email_address;

        await prisma.user.upsert({
          where: { clerkId },
          update: {
            email,
            name: `${first_name} ${last_name}`,
          },
          create: {
            clerkId,
            email,
            name: `${first_name} ${last_name}`,
          },
        });
        break;
      }

      // TODO: better validation
      case "organization.created": {
        const { created_by: clerkUserId, id: clerkOrgId } = evt.data;

        if (!clerkOrgId) {
          console.warn("Organization not found for clerkOrgId:", clerkOrgId);
          break;
        }

        if (!clerkUserId) {
          console.warn("User not found for userClerkId:", clerkUserId);
          break;
        }

        try {
          await prisma.$transaction(async (tx) => {
            const company = await tx.company.create({
              data: { clerkOrgId, ...createCompanyDefaultValues },
            });

            await tx.user.update({
              where: { clerkId: clerkUserId },
              data: { company: { connect: { clerkOrgId } } },
            });
          });

          break;
        } catch (error) {
          console.warn(`Failed to create company`);
          break;
        }
      }

      case "organizationMembership.created": {
        const { organization, public_user_data } = evt.data;
        const company = await prisma.company.findUnique({
          where: { clerkOrgId: organization.id },
        });

        if (!company) {
          console.warn("Company not found for clerkOrgId:", organization.id);
          break;
        }

        await prisma.user.update({
          where: { clerkId: public_user_data.user_id },
          data: { companyId: company.id },
        });
        break;
      }

      case "organizationMembership.deleted": {
        const { organization, public_user_data } = evt.data;
        const company = await prisma.company.findUnique({
          where: { clerkOrgId: organization.id },
        });

        if (!company) {
          console.warn("Company not found for clerkOrgId:", organization.id);
          break;
        }

        await prisma.user.updateMany({
          where: {
            clerkId: public_user_data.user_id,
            companyId: company.id,
          },
          data: { companyId: null },
        });
        break;
      }

      case "organizationMembership.updated": {
        const { organization, public_user_data, role } = evt.data;
        const { identifier, first_name, last_name, user_id } = public_user_data;
        const company = await prisma.company.findUnique({
          where: { clerkOrgId: organization.id },
        });

        if (!company) {
          console.warn("Company not found for clerkOrgId:", organization.id);
          break;
        }

        await prisma.user.update({
          where: { clerkId: user_id },
          data: {
            email: identifier,
            name: `${first_name} ${last_name}`,
          },
        });
      }
    }

    return NextResponse.json("OK", { status: 200 });
  } catch (error) {
    console.log("Error verifying webhook:", error);
    return NextResponse.json("Error verifying webhook", { status: 400 });
  }
}
