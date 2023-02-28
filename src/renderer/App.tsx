import { Container } from 'react-bootstrap';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import AddInterventionPage from './components/addintervention';
import AddPersonPage from './components/addperson';
import AssociationList from './components/associationlist';
import AssociationPage from './components/associationpage';
import EditPersonPage from './components/editpersonpage';
import Homepage from './components/homepage'
import ImportPage from './components/importpage';
import InterventionPage from './components/interventionpage';
import LocationPage from './components/locationpage';
import AppNavbar from './components/navbar';
import PersonPage from './components/personpage';
import Persons from './components/persons';
import ProjectPage from './components/projectpage';
import Projects from './components/projects';

export default function App() {
  return (
    <Router>
        <AppNavbar />
        <br />
        <Container>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/add" element={<AddPersonPage />} />
            <Route path="/persons" element={<Persons />} />
            <Route path="/person/:id" element={<PersonPage />} />
            <Route path="/person/:id/:familiar_id" element={<PersonPage />} />
            <Route path="/person/:id/edit" element={<EditPersonPage />} />        
            <Route path="/person/:id/newintervention" element={<AddInterventionPage />} />        
            <Route path="/associations" element={<AssociationList />} />
            <Route path="/associations/:id" element={<AssociationPage />} />
            <Route path="/locations/:id" element={<LocationPage />} />
            <Route path="/intervention/:id" element={<InterventionPage />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectPage />} />
            <Route path="/import" element={<ImportPage />} />
          </Routes>
        </Container>
      </Router>
  );
}
