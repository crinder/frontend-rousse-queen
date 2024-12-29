import React, { useState } from 'react'

const useForm = (initialObj) => {
  
  const [form,setForm] = useState(initialObj);

  const changed = (eventoOrdate,name) => {

        if(eventoOrdate instanceof Date){
            setForm({
                ...form,
                [name]:eventoOrdate
            })
        }else{
            const {name,value, type, selectedIndex} = eventoOrdate.target;
            const selectValue = type === 'select-one' ? eventoOrdate.target.options[selectedIndex].value : value;

            setForm({
                ...form,
                [name]:selectValue
            });
        }
        
  }
    return {
        form,
        changed
    }
}

export default useForm