import dpsLogo from './assets/DPS.svg';
import './App.css';
import { useState, useEffect } from "react";

// https://dummyjson.com/users

function App() {
	
	const url = "https://dummyjson.com/users";
	const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [data, setData] = useState([]);

        useEffect(() => {
            fetch(url)
                .then((result) => result.json())
                .then(
                    (data) => {
                        setIsLoaded(true);
                        setData(data);
                    },
                    // Handling errors
                    (error) => {
                        setIsLoaded(true);
                        setError(error);
                    }
                );
        }, []);
	
		const [searchTerm, setSearchTerm] = useState([]);
		const [filterBy, setState] = useState([]);
		const [showOldestCity, setOldestCity] = useState(true);
		const [filteredUsers, setFilteredUsers] = useState([]);
		
		// Function for Name Filter
		const updateSearchItem = (event: { target: { value: any; }; }) => {
			setFilteredUsers([]);
			setSearchTerm(event.target.value);
			if(event.target.value !=""){
				const filteredItems = data.users.filter((user) =>
			user.firstName.toLowerCase().includes(event.target.value.toLowerCase()) ||
			user.lastName.toLowerCase().includes(event.target.value.toLowerCase())
		  	);
		  	setFilteredUsers(filteredItems);
			}
		}
		// const debouncedUpdateSearch = React.useCallback(
		// 	debounce(updateSearchItem, 1000)
		//   , []);

		// Function for City Filter
		const updateFilter = (event: { target: { value: any; }; }) => {
			setFilteredUsers([]);
			setState(event.target.value);
			if(event.target.value !== "Select City"){
				const filteredItems = data.users.filter((user) =>
			user.address.city.toLowerCase().includes(event.target.value.toLowerCase())
		  	);
			  if(document.getElementById('checkbox') != null && document.getElementById('checkbox')?.checked){
				filteredItems.sort((a: { birthDate: { split: (arg0: string) => string | number | Date; }; }, b: { birthDate: { split: (arg0: string) => string | number | Date; }; }) => Date.parse(new Date(a.birthDate.split("-"))) - Date.parse(new Date(b.birthDate.split("-"))));
			  }
		  	setFilteredUsers(filteredItems);
			}
		}

		//Funtion for Highlighting Feature
		const toggleOldestCity = () =>{
			setOldestCity(!showOldestCity);
			setFilteredUsers([]);
			if(document.getElementById('city') != null && document.getElementById('city')?.value !== "Select City"){
			const filteredItems = data.users.filter((user) =>
			user.address.city.toLowerCase().includes(document.getElementById('city').value.toLowerCase())
		  	);
			if(showOldestCity){
				filteredItems.sort((a, b) => Date.parse(new Date(a.birthDate.split("-"))) - Date.parse(new Date(b.birthDate.split("-"))));
			}
		  	setFilteredUsers(filteredItems);
		}
	}


        if (error) {
            return <>{error}</>;
        } else if (!isLoaded) {
            return <>loading...</>;
        } else {

		return (
		<>
			<div>
				<a href="https://www.digitalproductschool.io/" target="_blank">
					<img src={dpsLogo} className="logo" alt="DPS logo" />
				</a>
			</div>
			<div className="home-card">
				<div className="row">
					<form>
					<div className="col">
						<label>Name </label>
						<input type="text" value={searchTerm} onChange={updateSearchItem} placeholder="Search.." id="search-text"/>
					</div>
					
					<div className="col">
						<label>City</label>
						<select value={filterBy} onChange={updateFilter} id="city">
							<option>Select City</option>
							{
								data.users.map((user) => (
								<option>{user.address.city}</option>
								))
							}	
						</select>
					</div>
					
					<div className="col">
						<label className='checkbox-highlight'>Highlight oldest per city</label>
						<input type='checkbox' id='checkbox' checked={!showOldestCity} onChange={toggleOldestCity}/>
					</div>
					
					</form>
				</div>
				<div className='user-result'>

					{filteredUsers.length !== 0
        			? <table className='table'>
						<tbody>
				 	 	<tr>
					  		<th>Name</th>
					 		 <th>City</th>
					  		<th>Birthday</th>
				 	 	</tr>
				  		{
						  filteredUsers.map((user) =>(
							  <tr>
								  <td>{user.firstName} {user.lastName}</td>
								  <td>{user.address.city}</td>
								  <td>{(new Date(user.birthDate)).toLocaleDateString('en-GB').replaceAll('/','.')}</td>
							  </tr>
							  ))
				  		}

				  		</tbody>
				  	</table>
        			: <p></p>
					}
				  

				{data != null && data.users.length != 0 &&  filteredUsers.length === 0 ? (
				<table className='table'>
        			<tbody>
					<tr>
						<th>Name</th>
						<th>City</th>
						<th>Birthday</th>
					</tr>
						{
							data.users.map((user) =>(
								<tr>
									<td>{user.firstName} {user.lastName}</td>
									<td>{user.address.city}</td>
									<td>{(new Date(user.birthDate)).toLocaleDateString('en-GB').replaceAll('/','.')}</td>
								</tr>
								))
							}
							
        			</tbody>
      			</table>
	  			): (<div></div>)}
				</div>
			</div>
		</>
	);
}
}

export default App;
