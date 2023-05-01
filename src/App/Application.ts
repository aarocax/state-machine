import { StateMachine, StateConfig, Transition } from './StateMachine'

class Application {

    form = document.querySelector('#form-spark') as HTMLFormElement;
    controls = this.form?.querySelector('section[data-type="form-controls"]');
    nextButton = this.controls?.querySelector('#next') as HTMLButtonElement;
    previousButton = this.controls?.querySelector('#previous') as HTMLButtonElement;
    language: string = "es";
    tabs: NodeListOf<HTMLElement> = document.querySelectorAll('[data-type="tab"]');

    stateConfig: StateConfig;
    stateMachine: StateMachine;

    constructor(stateConfig: StateConfig, stateMachine: StateMachine) {
        this.stateConfig = stateConfig;
        this.stateMachine = stateMachine;
        this.tabs[0].style.display = "grid";
        this.setEvents();
    }

    private setEvents() {
        
        this.nextButton.addEventListener('click', (e) => {
            const transition = this.findKeyInObject(this.stateConfig, this.stateMachine.getCurrentState());
            if(this.stateMachine.getCurrentState() !== this.stateMachine.getFinalState()) {
                this.stateMachine.send(transition.transitions[0].event);
                this.nextButton.disabled = (this.stateMachine.getCurrentState() === this.stateMachine.getFinalState()) ? true : false;
                this.tabs[transition.transitions[0].tab].style.display = "none";
                this.tabs[transition.transitions[0].show_tab].style.display = "grid";
            }
            this.previousButton.disabled = false;
        });

        this.previousButton.addEventListener('click', (e) => {
            const transition = this.findKeyInObject(this.stateConfig, this.stateMachine.getCurrentState());
            if(this.stateMachine.getCurrentState() !== "INITIAL") {
                this.stateMachine.send(transition.transitions[1].event);
                this.previousButton.disabled = (this.stateMachine.getCurrentState() === "INITIAL") ? true : false;
                this.tabs[transition.transitions[1].tab].style.display = "none";
                this.tabs[transition.transitions[1].show_tab].style.display = "grid";
            }
            this.nextButton.disabled = false;
        });
    }

    private findKeyInObject(obj: any | undefined, key: string): any {
        if (obj.hasOwnProperty(key)) {
          return obj[key];
        }
        for (const k in obj) {
          if (obj.hasOwnProperty(k)) {
            const value = obj[k];
            if (typeof value === 'object') {
              const result = this.findKeyInObject(value, key);
              if (result !== undefined) {
                return result;
              }
            }
          }
        }
      
        return undefined;
    }

}

fetch("/pruebas/state-machine-4/data/state_config_" + "es" + ".json")
    .then(response => response.json())
    .then((data) => {
        console.log(data);
        const stateConfig = data[0].transitions;
        const stateMachine = new StateMachine(stateConfig)
        new Application(stateConfig, stateMachine)
    })
    
