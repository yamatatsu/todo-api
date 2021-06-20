import React from "react";
import { PNG, Diagram, GeneralIcon } from "rediagram";
import {
  AWS,
  InvizAWS,
  EC2,
  Lambda,
  VPC,
  RDS,
  APIGateway,
  SecretsManager,
  Cognito,
} from "@rediagram/aws";

PNG(
  <Diagram title="TODO API">
    <InvizAWS>
      <AWS>
        <VPC>
          <VPC type="Private subnet">
            <Lambda
              name="Express Server"
              upstream={["MySQL", "Secrets for RDS"]}
            />
            <Lambda name="Migrater" upstream={["MySQL", "Secrets for RDS"]} />
          </VPC>
          <VPC type="Private subnet">
            <RDS name="MySQL" type="Aurora" />
          </VPC>
        </VPC>
        <SecretsManager name="Secrets for RDS" />
        <APIGateway name="REST API" upstream={["Express Server"]} />
        <Cognito name="UserPool" />
      </AWS>
      <GeneralIcon
        name="Client"
        type="Client"
        upstream={["REST API", "UserPool"]}
      />
    </InvizAWS>
  </Diagram>,
  { dir: "images" }
);
