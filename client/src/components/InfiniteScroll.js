// import React, { useState, useEffect ,useMemo,} from 'react';
// import InfiniteScroll from 'react-infinite-scroll-component';
// import { Store } from "../stores/store";
// function InfiniteScrollComponent() {
//     const [items, setItems] = useState([]);
//     const [hasMore, setHasMore] = useState(true);
//     const [page, setPage] = useState(1);
  
//     // Function to load more data
//     const fetchMoreData = () => {
//       // Fetch additional data and append it to the 'items' state
//       // You can fetch data from an API, database, or any other source.
//       // For simplicity, we'll add some dummy data here.
//       const newData = [...items, ...getMoreData(page)]; // Replace 'getMoreData' with your data source
  
//       setItems(newData);
//       setPage(page + 1);
  
//       // Assuming there's no more data to load, set 'hasMore' to 'false'
//       if (page >= 3) {
//         setHasMore(false);
//       }
//     };
  
//     // Dummy function to simulate data fetching
//     const getMoreData = (page) => {
//       const newData = [];
  
//       for (let i = 1; i <= 10; i++) {
//         newData.push(`Item ${i + (page - 1) * 10}`);
//       }
  
//       return newData;
//     };
  
//     useEffect(() => {
//       // Initial data fetching
//       fetchMoreData();
//     }, []);

//     const store = useMemo(() => new Store(), []);
//     useEffect(() => {
//         store.fetchProduct();
//       }, []);

//         const cardImageStyle = {
//     maxWidth: "50%", // Set the maximum width of the image to the card's width
//     height: "30vh", // Set the height to 30% of the viewport height
//     display: "block", // Set the image as a block element
//     margin: "auto", // Auto margin horizontally centers the image
//   };
//   function removePTags(htmlString) {
//     const div = document.createElement("div");
//     div.innerHTML = htmlString;
//     const paragraphs = div.querySelectorAll("p");

//     for (const p of paragraphs) {
//       const text = document.createTextNode(p.textContent);
//       p.parentNode.replaceChild(text, p);
//     }

//     return div.innerHTML;
//   }
//     return (
//       <div>
//         <InfiniteScroll
//           dataLength={items.length}
//           next={fetchMoreData}
//           hasMore={hasMore}
//           loader={<h4>Loading...</h4>}
//         >
//           { store.products.map((product) => (
//                         <div key={product.id} className="col-md-3">
//                           <div className="card">
//                             <img
//                               className="card-img-top"
//                               src={product.image}
//                               alt="cap"
//                               style={cardImageStyle} // Apply the custom image style here
//                             />
//                             <div className="card-body">
//                               <p className="card-text text-center text-lg text-bold">
//                                 {removePTags(product.product_name)}
//                               </p>

//                               <p className="card-text text-center">
//                                 {"$" + product.price}
//                               </p>
//                               <p className="card-text">
//                                 {removePTags(product.description)}
//                               </p>
//                               <div className="row">
//                                 <div className="col-md-6 mt-2">
//                                   <button
//                                     data-toggle="modal"
//                                     data-target="#modal-edit"
//                                     type="button"
//                                     className="btn btn-outline-primary custom-button-width"
//                                     onClick={() => showEdit(product.id)}
//                                   >
//                                     Edit
//                                   </button>
//                                 </div>

//                                 <div className="col-md-6 mt-2">
//                                   <button className="btn btn-outline-danger custom-button-width"       onClick={() => deleteHandler(product.id)}> 
//                                     Delete
//                                   </button>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       ))}


//         </InfiniteScroll>
//       </div>
//     );
//   }
  
//   export default InfiniteScrollComponent;
  