import React, { useState } from 'react';

const Duk = () => {
    const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);

    // Klausimų sąrašas
    const faqList = [
        {
            question: "Kas yra IT projektų platforma?",
            answer: "IT projektų platforma yra internetinis portalas, kuriame IT specialistai gali rasti projektus ir dalyvauti jų vykdyme."
        },
        {
            question: "Kaip galiu prisijungti prie platformos?",
            answer: "Norėdami prisijungti prie platformos, eikite į prisijungimo puslapį ir suveskite savo prisijungimo duomenis."
        },
        {
            question: "Kaip pateikti naują projektą?",
            answer: "Naują projektą galite pateikti paspaudę mygtuką „Pateikti projektą“ ir užpildę projektų pateikimo formą."
        },
        {
            question: "Ar galiu redaguoti savo pateiktą projektą?",
            answer: "Taip, galite redaguoti savo pateiktą projektą prisijungę prie savo paskyros ir pasirinkę projektą iš sąrašo."
        },
        {
            question: "Kaip galiu susisiekti su projekto iniciatoriumi?",
            answer: "Norėdami susisiekti su projekto iniciatoriumi, galite naudoti platformos žinučių sistemą arba nurodytus kontaktinius duomenis."
        }
    ];

    const toggleQuestion = (index: number) => {
        if (expandedQuestion === index) {
            setExpandedQuestion(null);
        } else {
            setExpandedQuestion(index);
        }
    };
    
    return (
        <div className="duk-page">
            <div className="content">
                <h1 className='title' style={{ marginLeft: '0px' }}> Dažniausiai užduodami klausimai </h1>
            </div>
            <div style={{ background: '#335285', borderRadius: '4px', padding: '8px', textAlign: 'center', marginLeft: '20px', marginBottom: '16px', marginRight: '30px' }}>
                <iframe 
                    width="100%" 
                    height="auto" 
                    src="https://www.youtube.com/embed/Sagg08DrO5U?start=2471" 
                    title="Video"
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                    style={{ marginTop: '20px', width: '70%', height: '80vh' }}
                ></iframe>
            </div>
            <div> </div>
            <div style={{ marginRight: '30px' }}>
                <div className="faq-list">
                    {/* Map'uojame klausimų sąrašą */}
                    {faqList.map((faq, index) => (
                        <div key={index} className="faq-item" style={{ marginBottom: '16px' }}>
                            {/* Rodyti klausimo tekstą */}
                            <div className="question" onClick={() => toggleQuestion(index)} style={{ background: '#335285', color: '#e1e5ed', borderRadius: '4px', padding: '8px', cursor: 'pointer', textAlign: 'left', marginLeft: '20px' }}>
                                <h3 style={{ margin: 0, fontSize: '20px'  }}>{faq.question}</h3>
                            </div>
                            {/* Rodyti atsakymą, jei klausimas išskleistas */}
                            {expandedQuestion === index && (
                                <div className="answer" style={{ background: '#335285', borderRadius: '4px', color: '#e1e5ed', padding: '8px', textAlign: 'left', marginLeft: '20px' }}>
                                    <p style={{ margin: 0, fontSize: '16px' }}>{faq.answer}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
    
}

export default Duk;
