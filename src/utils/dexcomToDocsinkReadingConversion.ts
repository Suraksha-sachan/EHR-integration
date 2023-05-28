import moment from "moment";
export function docsinkReadingFormat(data: any) {
    try {
        var date = data.systemTime;
        var parsedDate = moment(date).utc().format('YYYY-MM-DDTHH:mm:ss');

        const readingsObject = {
            'item_uuid': 697732698,
            'value': data.value,
            'measure_unit': data.unit,
            'manual_entry': false,
            'end_time': parsedDate + '+00:00',
            'start_time': parsedDate + '+00:00',
            'patient_uuid': data.patient_uuid,
            'vendor_source': 'Dexcom'
        }
        if (data.uuid) {
            readingsObject['uuid'] = data.uuid;
        }

        return readingsObject;
    } catch (error) {
        return error;
    }

}

