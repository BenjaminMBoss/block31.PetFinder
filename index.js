const pg = require('pg')

const client = new pg.Client('postgres://localhost/petfinder_backend_db')

const express = require('express')
const app = express();

const cors = require('cors')

app.get('/api/pets', async (req,res,next) => {
    try {
        const SQL = `
        SELECT *
        FROM pets
        `
        const response = await client.query(SQL)
        console.log(response.rows)
        res.send(response.rows)
    } catch (error) {
        next(error)
    }
})

const init = async () => {
    await client.connect();
    console.log("connected to database")
    const SQL = `
    DROP TABLE IF EXISTS pets;
    CREATE TABLE pets(
        id SERIAL PRIMARY KEY,
        name VARCHAR(20),
        is_favorite BOOLEAN
    );
    INSERT INTO pets (name,is_favorite) VALUES ('shaggy', false);
    INSERT INTO pets (name, is_favorite) VALUES ('scooby', true);
    INSERT INTO pets (name, is_favorite) VALUES ('scrappy', false);
    `
    await client.query(SQL);
    console.log('table created')

    const port = 3001;
    app.listen(port, () => {
        console.log(`listening on port ${port}`)
    })
}

init ();