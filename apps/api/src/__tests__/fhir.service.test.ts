import { describe, it, expect } from "vitest";
import {
  validateFhirResourcePayload,
  SUPPORTED_FHIR_RESOURCE_TYPES,
} from "../services/fhir.service";

describe("FHIR R4 Integration Service", () => {
  it("should list supported FHIR R4 resource types", () => {
    expect(SUPPORTED_FHIR_RESOURCE_TYPES).toContain("Patient");
    expect(SUPPORTED_FHIR_RESOURCE_TYPES).toContain("Practitioner");
    expect(SUPPORTED_FHIR_RESOURCE_TYPES).toContain("Appointment");
    expect(SUPPORTED_FHIR_RESOURCE_TYPES).toContain("Coverage");
  });

  it("should validate valid FHIR R4 payload without throwing", () => {
    const validPatientPayload = {
      resourceType: "Patient",
      id: "pat_12345",
      gender: "female",
    };

    expect(() => validateFhirResourcePayload("Patient", validPatientPayload)).not.toThrow();
  });

  it("should throw error on invalid FHIR payload format or mismatch", () => {
    expect(() => validateFhirResourcePayload("Patient", null)).toThrow(/expected an object/i);

    const mismatchedTypePayload = {
      resourceType: "Coverage",
      id: "cov_99",
    };

    expect(() => validateFhirResourcePayload("Patient", mismatchedTypePayload)).toThrow(
      /resourceType mismatch/i,
    );

    const missingIdPayload = {
      resourceType: "Patient",
    };

    expect(() => validateFhirResourcePayload("Patient", missingIdPayload)).toThrow(
      /missing required field "id"/i,
    );
  });
});
