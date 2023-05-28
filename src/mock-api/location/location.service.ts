import { Injectable } from "@nestjs/common";

@Injectable()
export class LocationApiService{
    async getAllLocation(){
        return {
            "link": [
                {
                    "relation": "next",
                    "url": "https://dev-integration.bots.docsink.com/api/mock-api/fhir/Location?_count=100"
                }
            ],
            "entry": [
                {
                    "resource": {
                        "resourceType": "Location",
                        "id": "1935217709431770",
                        "meta": {
                            "lastUpdated": "2021-04-28T08:29:05.773-04:00"
                        },
                        "text": {
                            "status": "generated",
                            "div": "<div xmlns=\"http://www.w3.org/1999/xhtml\"><table width=\"100%\"><tbody><tr><td width=\"25%\"><span class=\"text-muted\">FCT90791</span></td><td width=\"25%\"> -- <a href=\"Organization/DF-2663\">Organization/DF-2663</a><span> 2021/04/28</span></td></tr></tbody></table></div>"
                        },
                        "identifier": [
                            {
                                "type": {
                                    "coding": [
                                        {
                                            "system": "http://hl7.org/fhir/v2/0203",
                                            "code": "U",
                                            "display": "Unspecified Identifier"
                                        }
                                    ],
                                    "text": "Unspecified Identifier"
                                },
                                "system": "http://www.gehealthcare.com/fhir/cpsemr/namingsystem/LocationId/38707-44224-15155",
                                "value": "1935217709431770"
                            }
                        ],
                        "status": "active",
                        "_status": {
                            "extension": [
                                {
                                    "url": "http://hl7.org/fhir/StructureDefinition/ge-originalCode",
                                    "valueCoding": {
                                        "system": "http://www.gehealthcare.com/fhir/cpsemr/codesystem/locstatus",
                                        "code": "A",
                                        "display": "Active"
                                    }
                                }
                            ]
                        },
                        "name": "FCT90791",
                        "description": "FCT - Intake",
                        "telecom": [
                            {
                                "system": "phone",
                                "value": "9103430145",
                                "use": "work"
                            },
                            {
                                "system": "fax",
                                "value": "9103415779"
                            }
                        ],
                        "address": {
                            "line": [
                                "615 Shipyard Blvd"
                            ],
                            "city": "Wilmington",
                            "state": "NC",
                            "postalCode": "28412"
                        },
                        "managingOrganization": {
                            "reference": "Organization/DF-2663"
                        },
                        "partOf": {
                            "reference": "Location/1935217394413980"
                        }
                    }
                }
            ]
        }
    }

    async getNextLocation(){
       return {
        "link": [
            {
                "relation": "self",
                "url": "https://dev-integration.bots.docsink.com/api/mock-api/fhir/Location?_count=10"
            }
        ],
        "entry": [
            {
                "resource": {
                    "resourceType": "Location",
                    "id": "1935217709431771",
                    "meta": {
                        "lastUpdated": "2021-04-28T08:29:05.773-04:00"
                    },
                    "text": {
                        "status": "generated",
                        "div": "<div xmlns=\"http://www.w3.org/1999/xhtml\"><table width=\"100%\"><tbody><tr><td width=\"25%\"><span class=\"text-muted\">FCT90791</span></td><td width=\"25%\"> -- <a href=\"Organization/DF-2663\">Organization/DF-2663</a><span> 2021/04/28</span></td></tr></tbody></table></div>"
                    },
                    "identifier": [
                        {
                            "type": {
                                "coding": [
                                    {
                                        "system": "http://hl7.org/fhir/v2/0203",
                                        "code": "U",
                                        "display": "Unspecified Identifier"
                                    }
                                ],
                                "text": "Unspecified Identifier"
                            },
                            "system": "http://www.gehealthcare.com/fhir/cpsemr/namingsystem/LocationId/38707-44224-15155",
                            "value": "1935217709431771"
                        }
                    ],
                    "status": "active",
                    "_status": {
                        "extension": [
                            {
                                "url": "http://hl7.org/fhir/StructureDefinition/ge-originalCode",
                                "valueCoding": {
                                    "system": "http://www.gehealthcare.com/fhir/cpsemr/codesystem/locstatus",
                                    "code": "A",
                                    "display": "Active"
                                }
                            }
                        ]
                    },
                    "name": "TestLocation",
                    "description": "FCT - Intake",
                    "telecom": [
                        {
                            "system": "phone",
                            "value": "9103430145",
                            "use": "work"
                        },
                        {
                            "system": "fax",
                            "value": "9103415779"
                        }
                    ],
                    "address": {
                        "line": [
                            "615 Shipyard Blvd"
                        ],
                        "city": "Wilmington",
                        "state": "NC",
                        "postalCode": "28412"
                    },
                    "managingOrganization": {
                        "reference": "Organization/DF-2663"
                    },
                    "partOf": {
                        "reference": "Location/1935217394413980"
                    }
                }
            }
        ]
    }
    }
}
