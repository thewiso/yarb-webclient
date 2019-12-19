import { AxiosTransformer } from "axios";

const ISO_8601 = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.{0,1}\d*))(?:Z|(\+|-)([\d|:]*))?$/;

export const AxiosDeserialization: AxiosTransformer = function(data: any, headers?: any): any {
	if (typeof data === "string") {
		try {
			if (data) {
				data = JSON.parse(data, DateReviver);
			}
		} catch (e) {
			console.error(`Could not deserialize JSON: ${data}
			Error: ${e} `);
		}
	}

	return data;
};

export const DateReviver = function(key: string, value: any): any {
	if (typeof value === "string") {
		if (value.match(ISO_8601)) {
			value = new Date(value);
		}
	}
	return value;
};
