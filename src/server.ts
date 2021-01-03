import express from 'express';
import bodyParser from 'body-parser';
import { deleteLocalFiles, filterImageFromURL } from './util/util';

(async () => {

    const app = express();

    const port = process.env.PORT || 8082;

    app.use(bodyParser.json());

    // GET endpoint: /filteredimage
    // Example: /filteredimage?image_url=https://upload.wikimedia.org/wikipedia/commons/b/bd/Golden_tabby_and_white_kitten_n01.jpg
    app.get('/filteredimage', async (req: express.Request, res: express.Response) => {
        const imageUrl = req.query.image_url;
        if (!imageUrl) {
            return res.status(400).send({ message: 'Image URL is missing, provide image_url query parameter.' })
        }
        filterImageFromURL(imageUrl).then(filteredImagePath => {
            res.sendFile(filteredImagePath, () => {
                deleteLocalFiles([filteredImagePath]);
            })
        });
    });

    app.get('/', async (req: express.Request, res: express.Response) => {
        res.send('try GET /filteredimage?image_url=&lt;some-public-image-url&gt;')
    });


    app.listen(port, () => {
        console.log(`server running http://localhost:${port}`);
        console.log(`press CTRL+C to stop server`);
    });
})();
