const { json } = require('express');
const express = require('express');
const app = new express();
const redis = require('redis');

app.use(express.json());

let client = redis.createClient();

client.on('connect', function(){
    console.log('Connected to Redis....');
});

//set Port 
const port = 3000;

//Mengambil Semua Data
app.get('/siswa', function(req, res){
    keys = 'Siswa';

    client.get(keys, async function(err, value){
        data = JSON.parse(value);
        res.json(data);
        
    });
});

//Tambah Data
app.post('/siswa/tambah', (req, res) => {
    const keys = 'Siswa';

    let { id } = req.body;
    let { nama } = req.body;
    let { kelas } = req.body;

    let dataOld = [];
   
    client.get(keys, async function(err, value){
       
        let data = await JSON.parse(value)

        if(!data){

        }else{
            dataOld = data;
        }

        let dataNew = {
            'id' : id,
            'nama' : nama,
            'kelas' : kelas
        }
        
        dataOld.unshift(dataNew);

        const parsing = JSON.stringify(dataOld);

        client.set(keys, parsing, function(err, reply){
            if(err){
                console.log(err);
            }
            console.log(reply);

            res.send('Data Berhasil Di Tambah');
        });
    });
}); 

//Menghapus Data
app.delete('/siswa/:id', function(req, res) {
    const keys = "Siswa";
    const {id} = req.params;

    client.get(keys, async function(err, value) {
        const data = await JSON.parse(value);

        for(var i = 0; i < Object.keys(data).length; i++){
            if(data[i].id == id){
                data.splice([i], 1);
            }
        }

        const parsing = JSON.stringify(data);

        client.set(keys, parsing, function(err, reply){
            if(err){
                console.log(err);
            }

            console.log(reply);
            res.send("Data Berhasil Di Hapus");

        });
    });
});

//Mengubah Data
app.put('/siswa/:param', function(req, res){
    const keys = "Siswa";

    let { param } = req.params;
    let { id } = req.body;
    let { nama } = req.body;
    let { kelas } = req.body;

    client.get(keys, async function (err, value){
        let data = await JSON.parse(value);

        for(var i = 0 ; i < Object.keys(data).length ; i++){
            if(data[i].id == param){
                data[i].id = id;
                data[i].nama = nama;
                data[i].kelas = kelas;
            }
        }

        let parsing = JSON.stringify(data);

        client.set(keys, parsing, function(err, reply){
            if(err){
                console.log(err);
            }
            console.log(reply);

            res.send("Data Berhasil Di Ubah")
        });
    });
});


app.listen(port, function(){
    console.log('Server started on '+port);
});

//INCR id:users
//SET user:{id} '{"name":"Fred","age":25}'
//SADD users {id}