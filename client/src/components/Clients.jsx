import{ gql, useQuery} from '@apollo/client'
import ClientRow from './ClientRow'
import { GET_CLIENTS } from '../quires/clientQuries'



export default function Clients() {
   const { loading, error, data}= useQuery(GET_CLIENTS)
   if(loading) return <p> loading ....</p>
   if(error) return <p> Some thing Went Wrong</p>  
   return <> {!loading && !error && (
    <table className="table tabel-hover mt-3">
        <thead>
            <tr className="table-primary">
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            </tr>
        </thead>
        <tbody>
            {data.clients.map(client => (   
                <ClientRow key={client.id} client={client} />
            ))}
        </tbody>
    </table>
   )}</>
  
}
