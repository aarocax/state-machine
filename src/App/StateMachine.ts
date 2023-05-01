export { StateMachine, StateConfig, Transition };

type State = string;
type Event = string;

type Transition = {
  from: State;
  event: Event;
  to: State;
  tab: number;
  show_tab: number;
};

type StateConfig = {
  [key: string]: {
    transitions: Transition[];
    isInitial?: boolean;
    isFinal?: boolean;
  };
};

class StateMachine {
    private currentState: State;
    private stateConfig: StateConfig;
  
    constructor(stateConfig: StateConfig) {
      this.stateConfig = stateConfig;
      this.currentState = this.getInitialState();
    }
  
    public send(event: Event): void {
      const transition = this.stateConfig[this.currentState].transitions.find(
        t => t.event === event
      );
  
      if (transition) {
        this.currentState = transition.to;
      }
    }

    public getFinalState(): State {
      const finalState = Object.keys(this.stateConfig).find(
        key => this.stateConfig[key].isFinal
      );
      if (!finalState) {
        throw new Error('No final state found in state config');
      }
      return finalState;
    }
  
    public getCurrentState(): State {
      return this.currentState;
    }
  
    private getInitialState(): State {
      const initialState = Object.keys(this.stateConfig).find(
        key => this.stateConfig[key].isInitial
      );
      if (!initialState) {
        throw new Error('No initial state found in state config');
      }
      return initialState;
    }
  }
  

  