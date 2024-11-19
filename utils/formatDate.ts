const formatDate = (date: string) => {
    const formattedDate = new Date(date);
    return formattedDate.toLocaleDateString(); // Adjust formatting as needed
  };

  export default formatDate;