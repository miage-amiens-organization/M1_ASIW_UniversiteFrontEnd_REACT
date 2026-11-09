import { useState } from "react"
import { ApiError, creerEtudiant, type Etudiant } from "./api"
import { Alerte, EtapeIdentite, EtapeParcours, EtapeRecapitulatif, Etapes, Succes } from "./etapes"

// Version de départ, telle qu'un agent peut la proposer : elle fonctionne en démo.
// En TD : comptez les combinaisons d'états possibles, puis trouvez celles qui n'ont pas de sens.
export function InscriptionPage() {
  const [step, setStep] = useState(1)
  const [nom, setNom] = useState("")
  const [prenom, setPrenom] = useState("")
  const [email, setEmail] = useState("")
  const [parcoursId, setParcoursId] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isError, setIsError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [etudiant, setEtudiant] = useState<Etudiant | null>(null)

  const setters = { nom: setNom, prenom: setPrenom, email: setEmail }

  const handleIdentiteSuivant = () => {
    if (!nom || !prenom || !email.includes("@")) {
      setIsError(true)
      setErrorMessage("Renseignez le nom, le prénom et un e-mail valide.")
      return
    }
    setStep(2)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const cree = await creerEtudiant({ nom, prenom, email, parcours_id: parcoursId })
      setEtudiant(cree)
      setIsSuccess(true)
    } catch (error) {
      setIsError(true)
      if (error instanceof ApiError && error.status === 409) {
        setErrorMessage("Cet e-mail est déjà utilisé.")
        setStep(1)
        return
      }
      setErrorMessage("Impossible d'inscrire l'étudiant. Réessayez.")
    }
    setIsSubmitting(false)
  }

  const recommencer = () => {
    setStep(1)
    setNom("")
    setPrenom("")
    setEmail("")
    setParcoursId(null)
    setIsSuccess(false)
    setEtudiant(null)
  }

  return (
    <div className="w-full h-full p-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Inscription</h1>
      <div className="bg-white rounded-lg shadow p-6 w-full max-w-2xl">
        <Etapes courante={step} />
        {isError && <Alerte>{errorMessage}</Alerte>}
        {step === 1 && (
          <EtapeIdentite
            valeurs={{ nom, prenom, email }}
            onChange={(champ, valeur) => setters[champ](valeur)}
            onSuivant={handleIdentiteSuivant}
          />
        )}
        {step === 2 && (
          <EtapeParcours
            parcoursId={parcoursId}
            onChoisir={setParcoursId}
            onPrecedent={() => setStep(1)}
            onSuivant={() => setStep(3)}
          />
        )}
        {step === 3 && !isSuccess && (
          <EtapeRecapitulatif
            identite={{ nom, prenom, email }}
            parcoursId={parcoursId}
            envoiEnCours={isSubmitting}
            onPrecedent={() => setStep(2)}
            onConfirmer={handleSubmit}
          />
        )}
        {isSuccess && etudiant && <Succes etudiant={etudiant} onRecommencer={recommencer} />}
      </div>
    </div>
  )
}
