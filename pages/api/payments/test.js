
const webhookPayloadParser = (req) =>
    new Promise((resolve) => {
        let data = "";
        req.on("data", (chunk) => {
            data += chunk;
        });
        req.on("end", () => {
            resolve(Buffer.from(data).toString());
    });
});
export default async function test(req,res){
    res.statusCode = 200;
    res.send(await webhookPayloadParser(req));
}
