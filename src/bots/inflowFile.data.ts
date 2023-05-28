export function inFlowfile(payload,bot_name:string) {
  let inFlowFile = [];

  let configuration = payload.data

  for (let i = 0; i < Object.keys(configuration).length - 1; i++) {
    let k = Object.keys(configuration)[i];
    let v = configuration[k];

    if (k == "id" || k == "user_updated" || k == "date_updated") {
      continue;
    }

    inFlowFile.push(bot_name + ".configuration." + k, v);
  }
  
  return inFlowFile;
}
