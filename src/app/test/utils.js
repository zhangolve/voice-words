

export const retry = async (word)=> {
    await fetch('/api/test/vocabulary_for_ielts', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
      body: JSON.stringify({...word, mastered: false})
    })
}


export const master = async (word)=> {
    await fetch('/api/test/vocabulary_for_ielts', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
      body: JSON.stringify({...word, mastered: true})
    })
}