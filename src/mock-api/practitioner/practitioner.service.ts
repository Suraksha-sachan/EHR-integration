import { Injectable } from "@nestjs/common";

@Injectable()

export class PractitionerApiService{
    async getAllPractitioner(){
        return {
            "link": [
                {
                    "relation": "next",
                    "url": "https://dev-integration.bots.docsink.com/api/mock-api/fhir/Practitioner?_count=100"
                }
            ],
            "entry": [
                {
                    "resource": {
                        "resourceType": "Practitioner",
                        "id": "1946037960547520",
                        "meta": {
                            "profile": [
                                "http://hl7.org/fhir/StructureDefinition/daf-practitioner",
                                "http://hl7.org/fhir/StructureDefinition/ge-patient-profile.html"
                            ]
                        },
                        "text": {
                            "status": "generated"
                        },
                        "identifier": [
                            {
                                "type": {
                                    "coding": [
                                        {
                                            "system": "http://hl7.org/fhir/v2/0203",
                                            "code": "PN"
                                        }
                                    ]
                                },
                                "system": "http://www.gehealthcare.com/fhir/cpsemr/namingsystem/DOCTORFACILITYID/38707-44224-15155",
                                "value": "2755"
                            },
                            {
                                "type": {
                                    "coding": [
                                        {
                                            "system": "http://hl7.org/fhir/v2/0203",
                                            "code": "TIN"
                                        }
                                    ]
                                },
                                "system": "http://hl7.org/fhir/sid/us-tin",
                                "value": "560950370"
                            }
                        ],
                        "active": true,
                        "name": {
                            "family": [
                                "Stinson"
                            ],
                            "given": [
                                "Gina"
                            ]
                        },
                        "telecom": [
                            {
                                "system": "phone",
                                "value": "9107909949",
                                "use": "work"
                            },
                            {
                                "system": "phone",
                                "value": "9107909455",
                                "use": "mobile"
                            }
                        ],
                        "address": [
                            {
                                "line": [
                                    "4005 Oleander Dr"
                                ],
                                "city": "Wilmington",
                                "state": "NC",
                                "postalCode": "28403"
                            }
                        ],
                        "practitionerRole": [
                            {
                                "managingOrganization": {
                                    "reference": "Organization/DF-1924"
                                },
                                "role": {
                                    "coding": [
                                        {
                                            "system": "http://www.gehealthcare.com/fhir/cpsemr/codesystem/ROLELIST/38707-44224-15155",
                                            "code": "7",
                                            "display": "other provider"
                                        },
                                        {
                                            "system": "http://www.gehealthcare.com/fhir/cpsemr/codesystem/ROLELIST/38707-44224-15155",
                                            "code": "canSign"
                                        }
                                    ]
                                },
                                "location": [
                                    {
                                        "reference": "Location/1935217709431770"
                                    }
                                ]
                            }
                        ]
                    }
                }
            ]
        }
    }

    async getNextPractitioner(){
        return {
            "link": [
                {
                    "relation": "self",
                    "url": "https://dev-integration.bots.docsink.com/api/mock-api/fhir/Practitioner?_count=10"
                }
            ],
            "entry": [
                {
                    "resource": {
                        "resourceType": "Practitioner",
                        "id": "1946037960547521",
                        "meta": {
                            "profile": [
                                "http://hl7.org/fhir/StructureDefinition/daf-practitioner",
                                "http://hl7.org/fhir/StructureDefinition/ge-patient-profile.html"
                            ]
                        },
                        "text": {
                            "status": "generated"
                        },
                        "identifier": [
                            {
                                "type": {
                                    "coding": [
                                        {
                                            "system": "http://hl7.org/fhir/v2/0203",
                                            "code": "PN"
                                        }
                                    ]
                                },
                                "system": "http://www.gehealthcare.com/fhir/cpsemr/namingsystem/DOCTORFACILITYID/38707-44224-15155",
                                "value": "2755"
                            },
                            {
                                "type": {
                                    "coding": [
                                        {
                                            "system": "http://hl7.org/fhir/v2/0203",
                                            "code": "TIN"
                                        }
                                    ]
                                },
                                "system": "http://hl7.org/fhir/sid/us-tin",
                                "value": "560950370"
                            }
                        ],
                        "active": true,
                        "name": {
                            "family": [
                                "Test"
                            ],
                            "given": [
                                "Test"
                            ]
                        },
                        "telecom": [
                            {
                                "system": "phone",
                                "value": "9107909949",
                                "use": "work"
                            },
                            {
                                "system": "phone",
                                "value": "9107909455",
                                "use": "mobile"
                            }
                        ],
                        "address": [
                            {
                                "line": [
                                    "4005 Oleander Dr"
                                ],
                                "city": "Wilmington",
                                "state": "NC",
                                "postalCode": "28403"
                            }
                        ],
                        "practitionerRole": [
                            {
                                "managingOrganization": {
                                    "reference": "Organization/DF-1924"
                                },
                                "role": {
                                    "coding": [
                                        {
                                            "system": "http://www.gehealthcare.com/fhir/cpsemr/codesystem/ROLELIST/38707-44224-15155",
                                            "code": "7",
                                            "display": "other provider"
                                        },
                                        {
                                            "system": "http://www.gehealthcare.com/fhir/cpsemr/codesystem/ROLELIST/38707-44224-15155",
                                            "code": "canSign"
                                        }
                                    ]
                                },
                                "location": [
                                    {
                                        "reference": "Location/1935217709431771"
                                    }
                                ]
                            }
                        ]
                    }
                }
            ]
        }
    }
}