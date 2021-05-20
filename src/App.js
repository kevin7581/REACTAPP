import React from "react";
import './App.css'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      servicePayload:[],
      statusPayload:[],
      coveragePayload:[],
      data:[],
      perPage:10,
    }
    this.count = 0;
    
  }
  hanldeStatusChange(){
    const URL = 'https://jsonplaceholder.typicode.com/comments';
    fetch(URL)
    .then(response => response.json())
    .then(json => {
      let payload = [...this.state.statusPayload,...this.state.coveragePayload,...json]
      let result = payload.slice(0,this.state.perPage);
      this.setState({servicePayload:json,data:result})
    })
  }
  hanldeServiceChange(event){
    const URL = 'https://jsonplaceholder.typicode.com/users';
    fetch(URL)
    .then(response => response.json())
    .then(json => {
      let payload = [...this.state.servicePayload,...this.state.coveragePayload,...json];
      let result = payload.slice(0,this.state.perPage);
      this.setState({data:result,statusPayload:json})
    })
  }
  hanldeCoverageChange(){
    const URL = 'https://jsonplaceholder.typicode.com/posts';
    fetch(URL)
    .then(response => response.json())
    .then(json => {
      let payload = [...this.state.servicePayload,...this.state.statusPayload,...json];
      let result = payload.slice(0,this.state.perPage);
      this.setState({data:result,coveragePayload:json})
    })
  }
  hanldeFilter(link){
    const { servicePayload,statusPayload,coveragePayload,data } = this.state;
    let payload = [...servicePayload,...statusPayload,...coveragePayload];
    let result = payload.filter((item,index)=>{
      if((item.title && item.title[0].toUpperCase() === link.toUpperCase()) || (item.name && item.name[0].toUpperCase() === link.toUpperCase())){
        return item;
      }
    });
    this.setState({data:result})
  }
  getTableData(){
    const { data } = this.state;
    return data.length > 0 && data.map((item,index) => {
      return(
        <tr key={index}>
                <td>{item.id}</td>
                <td>{item.title || item.name}</td>
                <td>{item.body || item.username}</td>
              </tr>
      )
    })
  }
  getFilterLinks(){
    const filterLinks = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
    return filterLinks.map((item,index)=>{
      return (<a href="#" onClick={()=>this.hanldeFilter(item)}>{item}</a>)
    })
  }
  handlePagination(action){
    const { servicePayload,statusPayload,coveragePayload,data,perPage } = this.state;
    let payload = [...servicePayload,...statusPayload,...coveragePayload];
    let result = [];
    if(action==="next"){
      this.count++;
      result = payload.slice(this.count*perPage,((this.count*perPage) + (perPage)));
     }else if(action === "prev"){
      this.count--;
      result = payload.slice(((this.count)*perPage),(((this.count)*perPage) + (perPage)));
     }
    else if(action === "prevAll"){
      result = payload.slice(0,perPage);
    }
    else if(action === "nextAll"){
      result = payload.slice(payload.length-perPage,payload.length);
    }
    else{
      let num = Number(action);
      this.count = num;
      result = payload.slice(num*perPage,num*perPage+perPage);
    }
    this.setState({data:result})
  }
  handleListPerPage(event){
    const selectedCount = Number(event.target.value);
    const { servicePayload,statusPayload,coveragePayload,perPage } = this.state;
    let payload = [...servicePayload,...statusPayload,...coveragePayload];
    let result = payload.slice(0,selectedCount);
    this.setState({perPage:selectedCount,data:result}); 
  }
  getPaginationItems(){
    const { servicePayload,statusPayload,coveragePayload,perPage } = this.state;
    let payload = [...servicePayload,...statusPayload,...coveragePayload];
    
    let recordCount = payload.length / perPage;
    let list = [];
    for(let i=1;i<=recordCount;i++){
      list.push(<a href="#" onClick={()=>{this.handlePagination(i)}}>{i}</a>)
    }
    return list;
  }
  handleSort(order){
      let result = this.state.data.sort(function(a, b){
        const bandA = a.title && a.title.toUpperCase() || a.name && a.name.toUpperCase();
        const bandB = b.title && b.title.toUpperCase() || b.name && b.name.toUpperCase();
        let comparison = 0;
        if (bandA > bandB) {
          comparison = 1;
        } else if (bandA < bandB) {
          comparison = -1;
        }
        return (
          (order === 'dsc') ? (comparison * -1) : comparison
        );
      });
    
    this.setState({data:result})
  }
  render() {
    return (
      <div className="wrapper">
        <h1>React App</h1>
        <section className="custom-select">
         <div className="select-box">
            <h2>Select a Service Location : </h2>
            <select onChange={(event)=>this.hanldeServiceChange(event)}>
              <option> All </option>
              <option> Customer A</option>
              <option> Customer B</option>
              <option> Customer C</option>
            </select>
          </div>
          <div className="select-box">
          <h2>Show data for : </h2>
          <select onChange={(event)=>this.hanldeStatusChange(event)}>
            <option> All Memebers</option>
            <option> Customer A</option>
            <option> Customer B</option>
            <option> Customer C</option>
          </select>
          </div>
          <div className="select-box">
          <h2>Coverage : </h2>
          <select onChange={(event)=>this.hanldeCoverageChange(event)}>
            <option> All </option>
            <option> Customer A</option>
            <option> Customer B</option>
            <option> Customer C</option>
          </select>
          </div>
          <div className="filter-links">
          {this.getFilterLinks()}
          </div>
          <table id="customers">
            <thead>
              <tr>
                <th>ID</th>
                <th>Last Name <span className="sort-wrapper"><a className="sort-link" href="#" onClick={()=>{this.handleSort("asc")}}>ASC</a> <a className="sort-link" href="#" onClick={()=>{this.handleSort("dsc")}}>DSC</a></span></th>
                <th>First Name</th>
              </tr>
            </thead>
            
            <tbody>
              {this.getTableData()}
             </tbody>
            
          </table>
          {this.state.data.length > 0 ? null : <p className="record-found">No Records Found</p>}
        </section>
        <footer>
          <a href="#" onClick={()=>{this.handlePagination("prevAll")}} >{"<<"}</a>
            <a href="#" onClick={()=>{this.handlePagination("prev")}} >{"<"}</a>
            <span>{this.getPaginationItems()}</span>
            <a href="#" onClick={()=>{this.handlePagination("next")}} >{">"}</a>
            <a href="#" onClick={()=>{this.handlePagination("nextAll")}} >{">>"}</a>
            <select onChange={(event)=>{this.handleListPerPage(event)}}>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <span> Per page</span>
         </footer>
      </div>
    );
  }
}



export default App;
