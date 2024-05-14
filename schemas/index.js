import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connect = () => {
  mongoose
    .connect(
      `mongodb+srv://${process.env.DB_ID}:${process.env.DB_PW}@cluster0.70b0car.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`,
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