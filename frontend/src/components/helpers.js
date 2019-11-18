import { withApollo } from "react-apollo"
import { USER_DELETE } from "../../lib/gql/mutations"

let data = null
const helpers = {

    deleteUser: async function (selected, client) {

        // can't delete ROOT_ADMIN
        console.log(selected)
        await client
            .mutate({
                variables: { user_ids: selected },
                mutation: USER_DELETE,
            })
            .then(response => {
                console.log(response)
            })
            .catch(error => console.log(error))
        // return data
    },
    deleteRows: function (deletedIds, users) {
        // console.log(users, 'users')
        const data = users
        deletedIds.forEach(rowId => {
            const index = data.findIndex(row => row.id === rowId);
            if (index > -1) {
                data.splice(index, 1);
            }
        });
        //   console.log(data, 'users')

        return data;
    },
    deleteApiRows: function (deletedIds, apis) {
        // console.log(users, 'users')
        const data = apis
        deletedIds.forEach(rowId => {
            const index = data.findIndex(row => row.api_id === rowId);
            if (index > -1) {
                data.splice(index, 1);
            }
        });
        //  console.log(data, 'apis')

        return data;
    },
    getEmailFromId: function (selectedIds, allUsers, test) {
        let emails = []
        //   console.log(selectedIds, allUsers)
        allUsers.map((users, index) => {
            selectedIds.map(selected => {
                if (users.id === selected) {
                    emails = [...emails, users.email]
                }
            })
        })
        // console.log('emails', emails)
        return emails
    },
    /*
        createNewApikey: function (client) {
            console.log('api')
            client
                .mutate({
                    variables: {
                        id: "1",
                        get: "GET"
                    },
                    mutation: CREATE_NEW_APIKEY
                }).then(res => console.log(res.data.createNewApiKey))
        }*/
}



export default withApollo(helpers)
