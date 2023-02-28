const { ipcRenderer, contextBridge } = require('electron');

contextBridge.exposeInMainWorld('api', {
  // Invoke Methods
  testInvoke: (args: unknown[]) => ipcRenderer.invoke('test-invoke', args),
  // Send Methods
  testSend: (args: unknown[]) => ipcRenderer.send('test-send', args),
  // Insert person
  insertPerson: (args: unknown[]) => ipcRenderer.invoke('insert-person', args),
  // Insert family member
  insertFamilyMember: (args: unknown[]) => ipcRenderer.invoke('insert-family-member', args),
  // Insert an association
  insertAssociation: (args: unknown[]) => ipcRenderer.invoke('insert-association', args),
  // Insert referent
  insertReferent: (args: unknown[]) => ipcRenderer.invoke('insert-referent', args),
  // Insert location
  insertLocation: (args: unknown[]) => ipcRenderer.invoke('insert-location', args),
  // Update person
  updatePerson: (args: unknown[]) => ipcRenderer.invoke('update-person', args),
  // Search person
  searchPerson: (args: unknown[]) => ipcRenderer.invoke('search-person', args),
  // Search association
  searchAssociation: (args: unknown[]) => ipcRenderer.invoke('search-association', args),
  // Get all associations
  getAssociations: (args: unknown[]) => ipcRenderer.invoke('get-associations', args),
  // Get a single association
  getAssociation: (args: unknown[]) => ipcRenderer.invoke('get-association', args),
  // Find person by ID
  findPersonById: (args: unknown[]) => ipcRenderer.invoke('find-person-by-id', args),
  // Get association locations
  getAssociationLocations: (args: unknown[]) => ipcRenderer.invoke('get-locations', args),
  // Get a single location
  getLocation: (args: unknown[]) => ipcRenderer.invoke('get-location', args),
  // Get location referents
  getLocationReferents: (args: unknown[]) => ipcRenderer.invoke('get-referents', args),
  // Add intervention
  addIntervention: (args: unknown[]) => ipcRenderer.invoke('add-intervention', args),
  // Get intervention
  getIntervention: (args: unknown[]) => ipcRenderer.invoke('get-intervention', args),
  // Delete intervention
  deleteIntervention: (args: unknown[]) => ipcRenderer.invoke('delete-intervention', args),
  // Create project
  createProject: (args: unknown[]) => ipcRenderer.invoke('create-project', args),
  // Get All Projects
  getProjects: (args: unknown[]) => ipcRenderer.invoke('get-projects', args),
  // Get Single Project
  getProject: (args: unknown[]) => ipcRenderer.invoke('get-project', args),
  // Search Project
  searchProject: (args: unknown[]) => ipcRenderer.invoke('search-project', args),
  // Import persons
  importPersons: (args: unknown[]) => ipcRenderer.invoke('import-persons', args),
});