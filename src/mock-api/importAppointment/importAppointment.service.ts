import { Inject, Injectable } from "@nestjs/common";
import { BaseService } from "src/abstract";

@Injectable()

export class ImportAppointmentJobService extends BaseService
{
    async getImportAppointments()
    {
        return {
            "link": [
              {
                "relation": "next",
                "url": "https://dev-integration.bots.docsink.com/api/mock-api/fhir/Appointment?_count=100"
              }
            ],
            "entry": [
              {
                "resource": {
                  "resourceType": "Appointment",
                  "id": "1029555",
                  "meta": {
                    "lastUpdated": "2021-09-01T08:19:44.000-04:00",
                    "security": [
                      {
                        "system": "http://www.hl7.org/fhir/v3/Confidentiality",
                        "code": "R",
                        "display": "Restricted"
                      }
                    ]
                  },
                  "text": {
                    "status": "generated",
                    "div": "<div xmlns=\"http://www.w3.org/1999/xhtml\"><table width=\"100%\"><caption><a href=\"Patient/1946103575172880\">Patient/1946103575172880</a></caption><tbody><tr><td width=\"25%\"><span class=\"text-muted\">CCA - Initial</span></td><td width=\"8%\"><span class=\"text-muted\">2021/09/01 10:00</span></td><td width=\"25%\"> -- <a href=\"Practitioner/1838035494645330\">Practitioner/1838035494645330</a><span> 2021/09/01</span></td></tr></tbody></table></div>"
                  },
                  "status": "pending",
                  "_status": {
                    "extension": [
                      {
                        "url": "http://hl7.org/fhir/StructureDefinition/ge-originalCode",
                        "valueCoding": {
                          "system": "http://www.gehealthcare.com/fhir/cpsemr/codesystem/appointmentstatus_cps",
                          "code": "Default",
                          "display": "Pending"
                        }
                      }
                    ]
                  },
                  "type": {
                    "coding": [
                      {
                        "system": "http://hl7.org/fhir/StructureDefinition/ge-appointment-APPTDEF",
                        "code": "542",
                        "display": "CCA - Initial"
                      }
                    ],
                    "text": "CCA - Initial"
                  },
                  "description": "CCA - Initial",
                  "start": "2021-09-01T10:00:00.000-04:00",
                  "end": "2021-09-01T12:00:00.000-04:00",
                  "minutesDuration": 120,
                  "slot": [
                    {
                      "reference": "Slot/60914284"
                    }
                  ],
                  "participant": [
                    {
                      "actor": {
                        "reference": "Patient/19461035751"
                      }
                    },
                    {
                      "type": [
                        {
                          "coding": [
                            {
                              "system": "http://hl7.org/fhir/v3/ParticipationType",
                              "code": "PPRF",
                              "display": "primary performer"
                            }
                          ],
                          "text": "primary performer"
                        }
                      ],
                      "actor": {
                        "reference": "Practitioner/1946037960547520"
                      }
                    },
                    {
                      "actor": {
                        "reference": "Location/1935217709431770"
                      }
                    },
                    {
                      "type": [
                        {
                          "coding": [
                            {
                              "system": "http://www.gehealthcare.com/fhir/cpsemr/codesystem/PARTICIPANTTYPECPS",
                              "code": "Resource",
                              "display": "Resource"
                            }
                          ],
                          "text": "Resource"
                        }
                      ],
                      "actor": {
                        "reference": "Practitioner/1946037960547520"
                      }
                    }
                  ]
                }
              }
            ]
          } 
    }
}