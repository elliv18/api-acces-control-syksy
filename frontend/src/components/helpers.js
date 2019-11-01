import { withApollo } from "react-apollo"
import { USER_DELETE } from "../../lib/gql/mutations"

let data = null
const helpers = {

    deleteUser: function (selected, users, client) {

        // can't delete ROOT_ADMIN
        return selected.map((async (row) => {
            await client
                .mutate({
                    variables: { id: row },
                    mutation: USER_DELETE,
                })
                .then(response => {
                    console.log(response)
                })
                .catch(error => console.log(error))
        }))
        // return data
    },
    deleteRows: function (deletedIds, users) {
        console.log(users, 'users')
        const data = users
        deletedIds.forEach(rowId => {
            const index = data.findIndex(row => row.id === rowId);
            if (index > -1) {
                data.splice(index, 1);
            }
        });
        console.log(data, 'users')

        return data;
    }

}



export default withApollo(helpers)

/* //DELETE
        // can't delete ROOT_ADMIN
        this.state.selectedUserEmail !== "1"
            ? this.state.client
                .mutate({
                    variables: { id: this.state.selectedUserId },
                    mutation: USER_DELETE,
                })
                .then(response => {
                    let temp = null
                    // console.log(response)
                    temp = this.deleteRow(this.state.selectedUserId)
                    this.setState({ allUsers: temp })

                })

                .catch(error => console.log(error))

            : console.log('Cant delete admin')

*/