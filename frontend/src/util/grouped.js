export const groupedBySubcategory = (ques = [], doc = []) => {
  var sortData = {};
  var docData = {};
  var combinedData = {};
  let totalSubQuestion = 0;
  ques.map((item) => {
    if (item.type === "subcategory") {
      totalSubQuestion++;
      let ab = sortData[item.subcategoryId] || [];
      sortData[item.subcategoryId] = [...ab, item];
    }
  });

  doc.map((item) => {
    let ab = docData[item.subcategoryId] || [];
    docData[item.subcategoryId] = [...ab, item];
  });
  Object.keys(sortData).map(item=>{
      combinedData[item] ={
          questions: sortData[item],
          documents: docData[item]
      }
  })
  return {combinedData, totalSubQuestion};
};
