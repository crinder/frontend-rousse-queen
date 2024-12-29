import React, { useEffect, useState } from 'react';



const usePago = (initialObj,paymement,total) => {

    const [form,setForm] = useState(initialObj);

    useEffect(() => {
        if(paymement == 2){
            setForm(prevForm => ({
                ...prevForm,
                change_money: prevForm.received_money - total
            }));
        }
    }, [paymement, total]);
    

    const changed = (eventoOrdate,name) => {
  
          if(eventoOrdate instanceof Date){
              setForm({
                  ...form,
                  [name]:eventoOrdate
              })
          }else{
              const {name,value, type, selectedIndex} = eventoOrdate.target;
              const selectValue = type === 'select-one' ? eventoOrdate.target.options[selectedIndex].value : value;

              let updateValue = selectValue;

              console.log(updateValue);
              
              
              setForm({
                  ...form,
                  [name]:selectValue
              });
          }

          console.log(form);
          
    }
      return {
          form,
          changed
      }
}

export default usePago