import { use, useEffect, useRef, useState } from "react";

export default function Practice() {
    const text = "If you're visiting this page, you're likely here because you're searching for a random sentence. Sometimes a random word just isn't enough, and that is where the random sentence generator comes into play. By inputting the desired number, you can make a list of as many random sentences as you want or need. Producing random sentences can be helpful in a number of different ways.";
    const textRef = useRef(null);
    const [textMap, settextMap] = useState([]);
    const toType = text.split(' ');
    const [index, setIndex] = useState(0);
    const [innerIndex, setinnerIndex] = useState(-1);

    const [timer, setTimer] = useState(30);


    useEffect(() => {
        //Create map with letters and color
        const map = toType.map((word) => {
            return  word.split('').map((letter) => {
                return { letter: letter, status: -1 };
            })
        });
        console.log(map)
        settextMap(map);
        textRef.current.focus();

        const interval = setInterval(() => {
            setTimer((prev) => prev - 1);
        }, 1000);

        return () => {
            clearInterval(interval); // Clear the interval when the component is unmounted
        };
    }, [])


    //to compare text with typed text
    useEffect(() => {
        //compare by text splice
        console.log("Inner Index " + innerIndex)
        console.log("Index " + (textRef.current.value.split(' ').length - 1))
        if(innerIndex != -1){
            handleTextInput();
        }
    }, [innerIndex]);

    const handleTextInput = () => {
        if (textRef.current.value.length === 0) {
            console.log("Zero length")
            return;
        }

        for (let i = 0; i <= innerIndex; i++) {
            if (textRef.current.value.split(' ').slice(-1)[0][i] !== text.split(' ')[index][i]) {
                settextMap((prev) => {
                    const newMap = [...prev];
                    newMap[index][i].status = 0;
                    return newMap;
                });
            }
            else{
                settextMap((prev) => {
                    const newMap = [...prev];
                    newMap[index][i].status = 1;
                    return newMap;
                });
            }
        }
    }


    const handleBackSpace = (event) => {
        //spacebar
        if (event.key === " " && textRef.current.value.length !== 0) {
            setinnerIndex(-1);
        }
        if (event.key === "Backspace" && textRef.current.value.length !== 0 && innerIndex !== -1) {
            settextMap((prev) => {
                const newMap = [...prev];
                newMap[index][innerIndex].status = -1;
                return newMap;
            });
        } else if (event.ctrlKey && event.key === "Backspace") {
            console.log("Ctrl+Backspace");
            settextMap((prev) => {
                const newMap = [...prev];
                newMap.forEach((letter) => {
                    letter.status = -1;
                })
                return newMap;
            });
        }
    }

    return (
        <main className="h-screen flex flex-col justify-center items-center gap-10">
            <div className="flex flex-row justify-center items-center gap-10 text-3xl font-mono">
                <p>{timer}</p>
                <p>22 WPM</p>
                <p>94%</p>
            </div> 
            <div id="text-display">{textMap.map((word,outerInd) => {
                return (<span className="indent-3">{word.map((letter,innerInd) => {
                    var colors = "grey";
                    if (letter.status === 1) {
                        colors = "green";
                    }
                    else if (letter.status === 0) {
                        colors = "red";
                    }
                    return <span className={(outerInd == index && innerInd == innerIndex)? "blinker":""} style={{ color: colors }}>{letter.letter}</span>
                })} </span>)
            })}
            </div>

            {/* <p className="text-3xl font-bold tracking-wider text-neutral-700">{!status ? "Wrong" : "Right"}</p> */}
            <div>
                <input onBlur={()=>{
                     textRef.current.focus();
                }} tabIndex="0" autoFocus="true" id="user-input" ref={textRef} onKeyDown={handleBackSpace} type="text" placeholder="Start typing..." onChange={(event) => {
                    console.log("Text Ref length " + textRef.current.value.split(' ').slice(-1)[0].length)
                    console.log("Text Split " + text.split(' ')[index].length)
                    if(innerIndex!= -1 && textRef.current.value.split(' ').slice(-1)[0].length > text.split(' ')[index].length ){
                        textRef.current.value = textRef.current.value.slice(0,textRef.current.value.length-1);
                    }
                    console.log("Text " + textRef.current.value)
                    setIndex(textRef.current.value.split(' ').length - 1);
                    setinnerIndex(textRef.current.value.split(' ').slice(-1)[0].length - 1) //put 0 index
                }} />
            </div>
        </main>
    )
}
