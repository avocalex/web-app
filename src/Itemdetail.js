import React, {useState, useEffect} from 'react';
import './App.css';
import {Link} from 'react-router-dom';
import { inheritInnerComments } from '@babel/types';

function ItemDetail({match}) {
    useEffect(() => {
        console.log(match)
    }, []);

    return (
        <div>
            <h1>ID: {match.params.id}</h1>
        </div>
  );
}

export default ItemDetail;