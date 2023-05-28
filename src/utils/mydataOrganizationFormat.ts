

export async function mydataOrgForamt(payload, mydataId) {
    try {
        let data = {

            active: payload?.resource.active,
            organization_id: payload.resource.id,
            mydata_configuration: mydataId,
            name: payload?.resource.name,
            type: payload?.resource.type.text,
            phone: payload?.resource.telecom[0].value,
            address: payload?.resource.address[0].line[0],
            city: payload?.resource.address[0].city,
            state: payload?.resource.address[0].state,
            postalCode: payload?.resource.address[0].postalCode,
            content: payload?.resource
        }

        return data;

    } catch (error) {
        this._getBadRequestError(error.message);

    }
}