import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@mui/material';

import Navbar from '../navbar/Navbar';
import './recommendation.css';
import boy from "../../assets/images/boy.svg";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useNavigate } from "react-router-dom";
import { getRecommendationAPIMethod, updateQuestionAPIMethod } from "../../api/question";
    

const Recommendation = () => {
    const [recommendation, setRecommendation] = useState(null);
    const [recList, setRecList] = useState([]); // top 10 recommendation
    const { questionId, age, description } = useParams();
    const navigate = useNavigate();
    
    useEffect(() => {
        getRecommendationAPIMethod(age, description)
        .then(response => response.json())
        .then(data => {
            setRecommendation(data);
            if (data !== null && data.data !== undefined) {
                setRecList(data.data.slice(0, 10));
            }
        })
    }, []);

    const handleUpdateQuestion = () => {
        updateQuestionAPIMethod(questionId, recList)
            .then((response) => {
                if (response.ok) {
                    console.log("Recommendation record has been saved.");
                } else {
                    console.log("Error saving recommendation.");
                }
            })
            .catch((err) => {
                console.error("Error when saving recommendation:", err);
            })
    }
    
    return (
        <div className='recommendation'>
            {console.log('reclist: ', recList)}
            <Navbar />
            <div className='to_mainpage' onClick={() => navigate('/mainpage')}>
                <KeyboardBackspaceIcon />
                <div>To main page</div>
            </div>
            <div className='recommendation_outer'>
                {recList && (
                    <>
                    <h1>Recommendations ({recList.length})</h1>
                    <div className='recommendation_container'>
                        {recList.map((d) => (
                            <div className='recommendation_object'>
                                <div>{d.img}</div>
                                <div className='recommendation_object_bottom'>
                                    <h1>{d[2]}</h1>
                                    <p>By {d[3]}</p>
                                    <p>{d[13]}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    </>
                )}
            </div>
            <div className="buttons">
                <Button
                    variant="contained"
                    style={{ backgroundColor: "#ff395c", height: "40px"}}
                    onClick={handleUpdateQuestion}
                >
                    Save
                </Button>
                <Button
                    variant="contained"
                    style={{ backgroundColor: "#ff395c", height: "40px"}}
                    onClick={() => navigate('/mainpage')}
                >
                    Cancel
                </Button>
            </div>
        </div>
    )
}

export default Recommendation;