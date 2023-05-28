export async function practitionerDataFormats(payload: any , botConfig: any) {
    try {
        let data =
        {
            id: botConfig?.mydataPractitionerId,
            practitioner_id: payload?.resource.id,
            phone: payload.resource.telecom[1].value,
            mydata_configuration: botConfig?.mydata_configuration,
            address: payload?.resource.address[0].line[0],
            city: payload?.resource.address[0].city,
            state: payload?.resource.address[0].state,
            postalCode: payload?.resource.address[0].postalCode,
            first_name: payload?.resource.name.given[0],
            last_name: payload?.resource.name.family[0],
            role: payload?.resource.practitionerRole[0].role.coding[0].display,
            npi: payload?.resource.identifier[0].type.coding[0].code == 'NPI' ? payload.resource.identifier[0].value : null,
            location_primary: botConfig?.location_primary,
            content: payload?.resource,
        }
        return data;

    } catch (error) {
        this._getBadRequestError(error)

    }

}


export async function createOrgDocsinkProviderFormats(payload,email_domain) {
    try {
        let data =
        {
            first_name: payload?.first_name,
            last_name: payload?.last_name,
            phn_no: payload.phone ? Number(payload.phone) : null,
            email: payload?.first_name.toLowerCase() + '.' + payload?.last_name.toLowerCase() + '@' + `${email_domain}`,
            credentials: "-",
            active: true,
        }
        return data;
    } catch (error) {
        this._getBadRequestError(error.message);
    }
}


export async function createDocsinkProviderFormat(payload, docsink_organization) {
    try {

        let data = {

            docsink_organization: docsink_organization,
            credentials: payload?.data.credentials,
            first_name: payload?.data.fname,
            last_name: payload?.data.lname,
            email: payload?.data.user.email,
            is_primary_physician: payload?.data.is_primary_physician == 'Y' ? true : false,
            npi: payload.data.npi_no,
            phone: payload?.data.phn_no,
            uuid: payload.data.uuid,
            is_active: payload.data.active ? payload.data.active : true

        }

        return data;


    } catch (error) {
        this._getBadRequestError(error.message);

    }
}

export async function upsertDocsinkProviderFormat(payload, docsink_organization) {
    try {

        let data = {

            docsink_organization: docsink_organization,
            credentials: payload?.credentials,
            first_name: payload?.fname,
            last_name: payload?.lname,
            email: payload?.email_id,
            is_primary_physician: payload?.is_primary_physician == 'Y' ? true : false,
            npi: payload?.npi_no,
            phone: payload?.phn_no,
            uuid: payload.uuid,
            is_active: payload.active ? payload.active : true

        }
        return data;


    } catch (error) {
        this._getBadRequestError(error.message);

    }
}