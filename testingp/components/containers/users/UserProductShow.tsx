const  UserProductShow=({ item,index, removeApplication,toggleEdit }: any)=> {
  return (
    <tr key={index}>
      <th scope="row" className="text-center">
        {index + 1}
      </th>
      <td>{item.appName}</td>
      
      <td>{item.appUrl?item.appUrl: "--"}</td>
      <td className="text-center">
        <span
          onClick={removeApplication}
          className="ms-2"
          style={{ cursor: "pointer" }}
        >
          <i className="fas fa-trash-alt text-danger" title="Delete"></i>
        </span>
        <span
          onClick={toggleEdit}
          className="ms-3"
          style={{ cursor: "pointer" }}
        >
          <i
            className="fa-solid fa-pen-to-square text-warning"
            title="Edit"
          ></i>
        </span>
      </td>
    </tr>
  );
}

export default UserProductShow;
