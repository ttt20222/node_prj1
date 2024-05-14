import mongoose from 'mongoose';

const connect = () => {
  mongoose
    .connect(
      'mongodb+srv://ju83144:1234qwer@cluster0.70b0car.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
      {
        dbName: 'node_prj1',
      },
    )
    .catch((err) => console.log(err))
    .then(() => console.log('몽고디비 연결 성공'));
};

mongoose.connection.on('error', (err) => {
  console.error('몽고디비 연결 에러', err);
});

export default connect;