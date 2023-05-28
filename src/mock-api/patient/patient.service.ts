import { Injectable } from "@nestjs/common";
import { BaseService } from "src/abstract";

@Injectable()
export class PatientApiService extends BaseService{
    async getAllPatient(){
        return {
            "link": [
                {
                    "relation": "next",
                    "url": "https://dev-integration.bots.docsink.com/api/mock-api/fhir/Patient?_count=100"
                }
            ],
            "entry": [
                {
                    "resource": {
                        "resourceType": "Patient",
                        "id": "19461035751",
                        "meta": {
                            "lastUpdated": "2021-09-01T08:19:35.000-04:00",
                            "profile": [
                                "http://hl7.org/fhir/StructureDefinition/daf-patient",
                                "http://hl7.org/fhir/StructureDefinition/ge-patient-profile.html"
                            ],
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
                            "div": "<div xmlns=\"http://www.w3.org/1999/xhtml\"><table width=\"100%\"><tbody><tr><td width=\"25%\">DARREN B SMITH M DOB: 1975/02/02</td><td width=\"42%\">101 REMINGTON RD. Rocky Point, NC 28457 Phone: 9108001408 Phone: 9108001408 </td></tr></tbody></table></div>"
                        },
                        "extension": [
                            {
                                "url": "http://hl7.org/fhir/StructureDefinition/us-core-race",
                                "valueCodeableConcept": {
                                    "coding": [
                                        {
                                            "system": "http://hl7.org/fhir/v3/Race",
                                            "code": "2106-3",
                                            "display": "White"
                                        }
                                    ]
                                }
                            },
                            {
                                "url": "http://hl7.org/fhir/StructureDefinition/us-core-ethnicity",
                                "valueCodeableConcept": {
                                    "coding": [
                                        {
                                            "system": "http://hl7.org/fhir/v3/Ethnicity",
                                            "code": "2186-5",
                                            "display": "Not Hispanic or Latino"
                                        }
                                    ]
                                }
                            },
                            {
                                "url": "http://hl7.org/fhir/StructureDefinition/ge-patient-extension-RESPPROVID",
                                "valueReference": {
                                    "reference": "Practitioner/1946037960547520"
                                }
                            },
                            {
                                "url": "http://fhir.org/guides/argonaut/StructureDefinition/argo-race",
                                "extension": [
                                    {
                                        "url": "ombCategory",
                                        "valueCoding": {
                                            "system": "http://hl7.org/fhir/v3/Race",
                                            "code": "2106-3",
                                            "display": "White"
                                        }
                                    }
                                ]
                            },
                            {
                                "url": "http://fhir.org/guides/argonaut/StructureDefinition/argo-ethnicity",
                                "extension": [
                                    {
                                        "url": "ombCategory",
                                        "valueCoding": {
                                            "system": "http://hl7.org/fhir/v3/Ethnicity",
                                            "code": "2186-5",
                                            "display": "Not Hispanic or Latino"
                                        }
                                    }
                                ]
                            },
                            {
                                "url": "http://fhir.org/guides/argonaut/StructureDefinition/argo-birthsex",
                                "valueCode": "M"
                            }
                        ],
                        "identifier": [
                            {
                                "type": {
                                    "coding": [
                                        {
                                            "system": "http://hl7.org/fhir/v2/0203",
                                            "code": "PI"
                                        }
                                    ]
                                },
                                "system": "http://www.gehealthcare.com/fhir/cpsemr/namingsystem/PatientId/38707-44224-15155",
                                "value": "1059803"
                            },
                            {
                                "use": "secondary",
                                "type": {
                                    "coding": [
                                        {
                                            "system": "http://hl7.org/fhir/identifier-type",
                                            "code": "SB"
                                        }
                                    ]
                                },
                                "system": "http://hl7.org/fhir/sid/us-ssn",
                                "value": "239638195"
                            }
                        ],
                        "active": true,
                        "name": [
                            {
                                "use": "official",
                                "family": [
                                    "ADAMS"
                                ],
                                "given": [
                                    "LARRY",
                                    "B"
                                ]
                            }
                        ],
                        "telecom": [
                            {
                                "system": "phone",
                                "value": "3854897894",
                                "use": "home"
                            },
                            {
                                "system": "phone",
                                "value": "3854897894",
                                "use": "mobile"
                            }
                        ],
                        "gender": "male",
                        "_gender": {
                            "extension": [
                                {
                                    "url": "http://hl7.org/fhir/StructureDefinition/ge-originalCode",
                                    "valueCoding": {
                                        "system": "http://www.gehealthcare.com/fhir/cpsemr/codesystem/gender",
                                        "code": "M",
                                        "display": "Male"
                                    }
                                }
                            ]
                        },
                        "birthDate": "1975-02-02",
                        "deceasedBoolean": false,
                        "address": [
                            {
                                "line": [
                                    "423543 Citystreet"
                                ],
                                "city": "Rocky",
                                "state": "AL",
                                "postalCode": "456132"
                            }
                        ],
                        "managingOrganization": {
                            "reference": "Organization/LO-0"
                        }
                    }
                }
            ]
        }
    }

    async getNextPatient(){
        return {
            "link": [
              {
                "relation": "self",
                "url": "https://dev-integration.bots.docsink.com/api/mock-api/fhir/Patient?_count=10"
              }
            ],
            "entry": [
              {
                "resource": {
                  "resourceType": "Patient",
                  "id": "19461035752",
                  "meta": {
                    "lastUpdated": "2021-09-01T08:19:35.000-04:00",
                    "profile": [
                      "http://hl7.org/fhir/StructureDefinition/daf-patient",
                      "http://hl7.org/fhir/StructureDefinition/ge-patient-profile.html"
                    ],
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
                    "div": "<div xmlns=\"http://www.w3.org/1999/xhtml\"><table width=\"100%\"><tbody><tr><td width=\"25%\">DARREN B SMITH M DOB: 1975/02/02</td><td width=\"42%\">101 REMINGTON RD. Rocky Point, NC 28457 Phone: 9108001408 Phone: 9108001408 </td></tr></tbody></table></div>"
                  },
                  "extension": [
                    {
                      "url": "http://hl7.org/fhir/StructureDefinition/us-core-race",
                      "valueCodeableConcept": {
                        "coding": [
                          {
                            "system": "http://hl7.org/fhir/v3/Race",
                            "code": "2106-3",
                            "display": "White"
                          }
                        ]
                      }
                    },
                    {
                      "url": "http://hl7.org/fhir/StructureDefinition/us-core-ethnicity",
                      "valueCodeableConcept": {
                        "coding": [
                          {
                            "system": "http://hl7.org/fhir/v3/Ethnicity",
                            "code": "2186-5",
                            "display": "Not Hispanic or Latino"
                          }
                        ]
                      }
                    },
                    {
                      "url": "http://hl7.org/fhir/StructureDefinition/ge-patient-extension-RESPPROVID",
                      "valueReference": {
                        "reference": "Practitioner/1946037960547521"
                      }
                    },
                    {
                      "url": "http://fhir.org/guides/argonaut/StructureDefinition/argo-race",
                      "extension": [
                        {
                          "url": "ombCategory",
                          "valueCoding": {
                            "system": "http://hl7.org/fhir/v3/Race",
                            "code": "2106-3",
                            "display": "White"
                          }
                        }
                      ]
                    },
                    {
                      "url": "http://fhir.org/guides/argonaut/StructureDefinition/argo-ethnicity",
                      "extension": [
                        {
                          "url": "ombCategory",
                          "valueCoding": {
                            "system": "http://hl7.org/fhir/v3/Ethnicity",
                            "code": "2186-5",
                            "display": "Not Hispanic or Latino"
                          }
                        }
                      ]
                    },
                    {
                      "url": "http://fhir.org/guides/argonaut/StructureDefinition/argo-birthsex",
                      "valueCode": "M"
                    }
                  ],
                  "identifier": [
                    {
                      "type": {
                        "coding": [
                          {
                            "system": "http://hl7.org/fhir/v2/0203",
                            "code": "PI"
                          }
                        ]
                      },
                      "system": "http://www.gehealthcare.com/fhir/cpsemr/namingsystem/PatientId/38707-44224-15155",
                      "value": "1059803"
                    },
                    {
                      "use": "secondary",
                      "type": {
                        "coding": [
                          {
                            "system": "http://hl7.org/fhir/identifier-type",
                            "code": "SB"
                          }
                        ]
                      },
                      "system": "http://hl7.org/fhir/sid/us-ssn",
                      "value": "239638195"
                    }
                  ],
                  "active": true,
                  "name": [
                    {
                      "use": "official",
                      "family": [
                        "TestPatient"
                      ],
                      "given": [
                        "TestPatient",
                        "B"
                      ]
                    }
                  ],
                  "telecom": [
                    {
                      "system": "phone",
                      "value": "3854897891",
                      "use": "work"
                    },
                    {
                      "system": "phone",
                      "value": "3854897891",
                      "use": "mobile"
                    }
                  ],
                  "gender": "male",
                  "_gender": {
                    "extension": [
                      {
                        "url": "http://hl7.org/fhir/StructureDefinition/ge-originalCode",
                        "valueCoding": {
                          "system": "http://www.gehealthcare.com/fhir/cpsemr/codesystem/gender",
                          "code": "M",
                          "display": "Male"
                        }
                      }
                    ]
                  },
                  "birthDate": "1976-03-03",
                  "deceasedBoolean": false,
                  "address": [
                    {
                      "line": [
                        "423543 Citystreet"
                      ],
                      "city": "Rocky",
                      "state": "AL",
                      "postalCode": "456132"
                    }
                  ],
                  "managingOrganization": {
                    "reference": "Organization/LO-0"
                  }
                }
              }
            ]
          }
    }

    async getPatientById(id:string){
      let data = [{
        "resourceType":"Patient",
        "id":"19461035751",
        "meta":{
        "lastUpdated":"2021-09-01T08:19:35.000-04:00",
        "profile":[
        "http://hl7.org/fhir/StructureDefinition/daf-patient",
        "http://hl7.org/fhir/StructureDefinition/ge-patient-profile.html"
        ],
        "security":[
        {
        "system":"http://www.hl7.org/fhir/v3/Confidentiality",
        "code":"R",
        "display":"Restricted"
        }
        ]
        },
        "text":{
        "status":"generated",
        "div":"<div xmlns=\"http://www.w3.org/1999/xhtml\"><table width=\"100%\"><tbody><tr><td width=\"25%\">DARREN B SMITH M DOB: 1975/02/02</td><td width=\"42%\">101 REMINGTON RD. Rocky Point, NC 28457 Phone: 9108001408 Phone: 9108001408 </td></tr></tbody></table></div>"
        },
        "extension":[
        {
        "url":"http://hl7.org/fhir/StructureDefinition/us-core-race",
        "valueCodeableConcept":{
        "coding":[
        {
        "system":"http://hl7.org/fhir/v3/Race",
        "code":"2106-3",
        "display":"White"
        }
        ]
        }
        },
        {
        "url":"http://hl7.org/fhir/StructureDefinition/us-core-ethnicity",
        "valueCodeableConcept":{
        "coding":[
        {
        "system":"http://hl7.org/fhir/v3/Ethnicity",
        "code":"2186-5",
        "display":"Not Hispanic or Latino"
        }
        ]
        }
        },
        {
        "url":"http://hl7.org/fhir/StructureDefinition/ge-patient-extension-RESPPROVID",
        "valueReference":{
        "reference":"Practitioner/1946037960547520"
        }
        },
        {
        "url":"http://fhir.org/guides/argonaut/StructureDefinition/argo-race",
        "extension":[
        {
        "url":"ombCategory",
        "valueCoding":{
        "system":"http://hl7.org/fhir/v3/Race",
        "code":"2106-3",
        "display":"White"
        }
        }
        ]
        },
        {
        "url":"http://fhir.org/guides/argonaut/StructureDefinition/argo-ethnicity",
        "extension":[
        {
        "url":"ombCategory",
        "valueCoding":{
        "system":"http://hl7.org/fhir/v3/Ethnicity",
        "code":"2186-5",
        "display":"Not Hispanic or Latino"
        }
        }
        ]
        },
        {
        "url":"http://fhir.org/guides/argonaut/StructureDefinition/argo-birthsex",
        "valueCode":"M"
        }
        ],
        "identifier":[
        {
        "type":{
        "coding":[
        {
        "system":"http://hl7.org/fhir/v2/0203",
        "code":"PI"
        }
        ]
        },
        "system":"http://www.gehealthcare.com/fhir/cpsemr/namingsystem/PatientId/38707-44224-15155",
        "value":"1059803"
        },
        {
        "use":"secondary",
        "type":{
        "coding":[
        {
        "system":"http://hl7.org/fhir/identifier-type",
        "code":"SB"
        }
        ]
        },
        "system":"http://hl7.org/fhir/sid/us-ssn",
        "value":"239638195"
        }
        ],
        "active":true,
        "name":[
        {
        "use":"official",
        "family":[
        "ADAMS"
        ],
        "given":[
        "LARRY",
        "B"
        ]
        }
        ],
        "telecom":[
        {
        "system":"phone",
        "value":"3854897894",
        "use":"home"
        },
        {
        "system":"phone",
        "value":"3854897894",
        "use":"mobile"
        }
        ],
        "gender":"male",
        "_gender":{
        "extension":[
        {
        "url":"http://hl7.org/fhir/StructureDefinition/ge-originalCode",
        "valueCoding":{
        "system":"http://www.gehealthcare.com/fhir/cpsemr/codesystem/gender",
        "code":"M",
        "display":"Male"
        }
        }
        ]
        },
        "birthDate":"1975-02-02",
        "deceasedBoolean":false,
        "address":[
        {
        "line":[
        "423543 Citystreet"
        ],
        "city":"Rocky",
        "state":"AL",
        "postalCode":"456132"
        }
        ],
        "managingOrganization":{
        "reference":"Organization/LO-0"
        }
        },
        {
        "resourceType":"Patient",
        "id":"19461035752",
        "meta":{
        "lastUpdated":"2021-09-01T08:19:35.000-04:00",
        "profile":[
        "http://hl7.org/fhir/StructureDefinition/daf-patient",
        "http://hl7.org/fhir/StructureDefinition/ge-patient-profile.html"
        ],
        "security":[
        {
        "system":"http://www.hl7.org/fhir/v3/Confidentiality",
        "code":"R",
        "display":"Restricted"
        }
        ]
        },
        "text":{
        "status":"generated",
        "div":"<div xmlns=\"http://www.w3.org/1999/xhtml\"><table width=\"100%\"><tbody><tr><td width=\"25%\">DARREN B SMITH M DOB: 1975/02/02</td><td width=\"42%\">101 REMINGTON RD. Rocky Point, NC 28457 Phone: 9108001408 Phone: 9108001408 </td></tr></tbody></table></div>"
        },
        "extension":[
        {
        "url":"http://hl7.org/fhir/StructureDefinition/us-core-race",
        "valueCodeableConcept":{
        "coding":[
        {
        "system":"http://hl7.org/fhir/v3/Race",
        "code":"2106-3",
        "display":"White"
        }
        ]
        }
        },
        {
        "url":"http://hl7.org/fhir/StructureDefinition/us-core-ethnicity",
        "valueCodeableConcept":{
        "coding":[
        {
        "system":"http://hl7.org/fhir/v3/Ethnicity",
        "code":"2186-5",
        "display":"Not Hispanic or Latino"
        }
        ]
        }
        },
        {
        "url":"http://hl7.org/fhir/StructureDefinition/ge-patient-extension-RESPPROVID",
        "valueReference":{
        "reference":"Practitioner/1946037960547521"
        }
        },
        {
        "url":"http://fhir.org/guides/argonaut/StructureDefinition/argo-race",
        "extension":[
        {
        "url":"ombCategory",
        "valueCoding":{
        "system":"http://hl7.org/fhir/v3/Race",
        "code":"2106-3",
        "display":"White"
        }
        }
        ]
        },
        {
        "url":"http://fhir.org/guides/argonaut/StructureDefinition/argo-ethnicity",
        "extension":[
        {
        "url":"ombCategory",
        "valueCoding":{
        "system":"http://hl7.org/fhir/v3/Ethnicity",
        "code":"2186-5",
        "display":"Not Hispanic or Latino"
        }
        }
        ]
        },
        {
        "url":"http://fhir.org/guides/argonaut/StructureDefinition/argo-birthsex",
        "valueCode":"M"
        }
        ],
        "identifier":[
        {
        "type":{
        "coding":[
        {
        "system":"http://hl7.org/fhir/v2/0203",
        "code":"PI"
        }
        ]
        },
        "system":"http://www.gehealthcare.com/fhir/cpsemr/namingsystem/PatientId/38707-44224-15155",
        "value":"1059803"
        },
        {
        "use":"secondary",
        "type":{
        "coding":[
        {
        "system":"http://hl7.org/fhir/identifier-type",
        "code":"SB"
        }
        ]
        },
        "system":"http://hl7.org/fhir/sid/us-ssn",
        "value":"239638195"
        }
        ],
        "active":true,
        "name":[
        {
        "use":"official",
        "family":[
        "TestPatient"
        ],
        "given":[
        "TestPatient",
        "B"
        ]
        }
        ],
        "telecom":[
        {
        "system":"phone",
        "value":"3854897891",
        "use":"work"
        },
        {
        "system":"phone",
        "value":"3854897891",
        "use":"mobile"
        }
        ],
        "gender":"male",
        "_gender":{
        "extension":[
        {
        "url":"http://hl7.org/fhir/StructureDefinition/ge-originalCode",
        "valueCoding":{
        "system":"http://www.gehealthcare.com/fhir/cpsemr/codesystem/gender",
        "code":"M",
        "display":"Male"
        }
        }
        ]
        },
        "birthDate":"1976-03-03",
        "deceasedBoolean":false,
        "address":[
        {
        "line":[
        "423543 Citystreet"
        ],
        "city":"Rocky",
        "state":"AL",
        "postalCode":"456132"
        }
        ],
        "managingOrganization":{
        "reference":"Organization/LO-0"
        }
        }];
        let patientById = data.filter(patient => {
          return patient.id == id;
      });
      if(patientById.length == 0){
    
          this._getNotFoundError(`Patient with id:${id} can't get.`)
      }
      return patientById[0]; 
    }
}