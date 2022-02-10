import { getFirebaseAdmin } from 'next-firebase-auth'
import Head from 'next/head'
import { withFirebaseAuthUserTokenSSR } from '../components/auth/firebase'
import VehicleCardList from '../components/shop/VehicleCardList'
import styles from '../styles/Home.module.css'

export default function Home({vehicles,dealers}) {
  console.log(vehicles)
  console.log(dealers)
  return (
    <div className={styles.container}>
      <Head>
        <title>ShowRoom X</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <VehicleCardList vehicles={vehicles} dealers ={dealers} />
      </main>
    </div>
  )
}

export const getServerSideProps =  withFirebaseAuthUserTokenSSR()(async () => {
  const admin = getFirebaseAdmin();
  const vehicleDocs = await admin.firestore().collection('vehicles').get();
  const vehicles = {
    vehicles: {},
    ids: []
  };
  const dealers = {
    dealers: {},
    ids: []
  }
  const tasks = [];
  vehicleDocs.forEach(vehicle => {
    tasks.push(
      (async function(){
        vehicles.vehicles[vehicle.id] = {id: vehicle.id,data: vehicle.data()};
        vehicles.ids.push(vehicle.id);
        if(!dealers.dealers[vehicle.data().dealerId]){
          const d = await admin.firestore().collection('dealers').doc(vehicle.data().dealerId).get();
          if(!d.exists)
            return;
          dealers.ids.push(d.id);
          dealers.dealers[d.id] = {id: d.id,data: d.data()};
        }
      })() 
    )
  })
  console.log(vehicles)
  console.log(dealers)
  await Promise.all(tasks);
  return {
    props: {
      vehicles,
      dealers
    }
  }
})
