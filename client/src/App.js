import React, { useEffect, useState } from "react";
import axios from "axios";
import TableRow from "./TableRow";
import Pagination from "./Pagination";

const App = () => {
  const [items, setItems] = useState([]);
  const [sortDirection, setSortDirection] = useState(true);

  const [column, setColumn] = useState("");
  const [criteria, setCriteria] = useState("");
  const [criteriaValue, setCriteriaValue] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    axios.get("http://localhost:5000").then(function (response) {
      console.log(response.data);
      setItems(response.data);
    });
  }, []);

  const sortData = (type) => {
    sortDirection
      ? setItems([...items].sort((a, b) => (a[type] > b[type] ? 1 : -1)))
      : setItems([...items].reverse((a, b) => (b[type] > a[type] ? 1 : -1)));
    setSortDirection(!sortDirection);
  };

  const onColumnChange = (e) => setColumn(e.target.value);
  const onSelectCriteria = (e) => setCriteria(e.target.value);
  const onCriteriaValueChange = (e) => setCriteriaValue(e.target.value);

  const filterByCriteria = (type) => {
    if (criteria === "equal") {
      return items.filter((item) => item[type] === +criteriaValue);
    }
    if (criteria === "contain") {
      return items.filter((item) =>
        item[type].toString().toLowerCase().includes(criteriaValue)
      );
    }
    if (criteria === "greater") {
      return items.filter((item) => item[type] >= +criteriaValue);
    }
    if (criteria === "less") {
      return items.filter((item) => item[type] <= +criteriaValue);
    }
  };

  const filter = () => {
    if (!column || !criteria || !criteriaValue) {
      return items;
    }
    if (column === "Date") {
      return filterByCriteria("date");
    }
    if (column === "Name") {
      return filterByCriteria("name");
    }
    if (column === "Quantity") {
      return filterByCriteria("quantity");
    }
    if (column === "Distance") {
      return filterByCriteria("distance");
    }
  };
  const filteredItems = filter();

  const lastItemIndex = currentPage * itemsPerPage;
  const firstItemIndex = lastItemIndex - itemsPerPage;
  const currentItems = filteredItems.slice(firstItemIndex, lastItemIndex);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage((prev) => prev + 1);
  const prevPage = () => setCurrentPage((prev) => prev - 1);

  return (
    <div>
      <h1 className="text-center">Test</h1>
      <form className="form-inline d-flex justify-content-around">
        <div className="form-group mb-2">
          <select className="form-control" onChange={onColumnChange}>
            <option value="">All columns</option>
            <option>Date</option>
            <option>Name</option>
            <option>Quantity</option>
            <option>Distance</option>
          </select>
        </div>
        <div className="form-group mb-3">
          <select className="form-control" onChange={onSelectCriteria}>
            <option value="">No criteria</option>
            <option>equal</option>
            <option>contain</option>
            <option>greater</option>
            <option>less</option>
          </select>
        </div>
        <div className="form-group mb-3">
          <input
            className="form-control"
            type="text"
            placeholder="option"
            value={criteriaValue}
            onChange={onCriteriaValueChange}
          />
          {/* <div
            className="btn btn-primary"
            onClick={() => {
              filter();
            }}
          >
            <i className="fa-solid fa-magnifying-glass"></i>
          </div> */}
        </div>
      </form>
      <table className="table table-condensed table-striped table-bordered">
        <thead>
          <tr>
            <th>
              <p className="text-center">Date</p>
            </th>

            <th
              onClick={() => {
                sortData("name");
              }}
            >
              <p className="text-center">
                Name
                <i className="fa-solid fa-sort pl-2"></i>
              </p>
            </th>
            <th
              onClick={() => {
                sortData("quantity");
              }}
            >
              <p className="text-center">
                Quantity
                <i className="fa-solid fa-sort pl-2"></i>
              </p>
            </th>
            <th
              onClick={() => {
                sortData("distance");
              }}
            >
              <p className="text-center">
                Distance
                <i className="fa-solid fa-sort pl-2"></i>
              </p>
            </th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((obj, i) => (
            <TableRow
              key={i}
              date={obj.date}
              name={obj.name}
              quantity={obj.quantity}
              distance={obj.distance}
            />
          ))}
        </tbody>
      </table>
      <Pagination
        itemsPerPage={itemsPerPage}
        totalItems={items.length}
        paginate={paginate}
      />
      <div className="d-flex justify-content-center">
        <button className="btn" onClick={prevPage}>
          Prev Page
        </button>
        <button className="btn ml-2" onClick={nextPage}>
          Next Page
        </button>
      </div>
    </div>
  );
};

export default App;
