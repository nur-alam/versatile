/**
 * ajaxHandler for handling ajax request
 *
 * @since 1.0.0
 * @param {*} formData
 * @return json response
 */

export async function ajaxHandler(formData, jsonRes = true) {
	const { ajax_url, nonce_key, nonce_value } = triggerObject;
	// Append nonce field to form data

	formData.append(nonce_key, nonce_value);
	try {
		const post = await fetch(ajax_url, {
			method: 'POST',
			body: formData,
		});
		if (post.ok) {
			if (jsonRes) {
				return await post.json();
			} else {
				return await post.text();
			}
		}
	} catch (error) {
		console.log(error);
	}
}
