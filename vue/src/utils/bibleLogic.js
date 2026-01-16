// Cette fonction prend la position_globale et la transforme en texte lisible
// On l'utilisera après avoir récupéré les données de chapters_reference
export const formatBiblePosition = (allChapters, globalPos) => {
    if (globalPos <= 0) return "Pas encore commencé"
    
    const chapter = allChapters.find(c => c.position_globale === globalPos)
    
    if (chapter) {
      return `${chapter.livre} ${chapter.numero_chapitre}`
    }
    
    return "Fin du Nouveau Testament"
  }