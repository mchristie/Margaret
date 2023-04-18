const Settings = new class {
    constructor() {
        this.settings = {};

        this.setDefaultSettings();
    }

    setDefaultSettings() {
        this.settings = {
            'name' : window.localStorage.getItem('name') || this.makeName(),
        }
    }

    get(setting) {
        return this.settings[setting];
    }

    makeName() {
        const colors = [
            'Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Pink', 'Orange', 'Brown',
            'Black', 'White', 'Gray', 'Gold', 'Silver', 'Navy', 'Teal', 'Indigo',
            'Magenta', 'Violet', 'Khaki', 'Salmon', 'Crimson', 'Lavender', 'Plum',
            'Olive', 'Cyan', 'Maroon', 'Beige',
        ];

        const animals = [
            'Aardvark', 'Alpaca', 'Antelope', 'Armadillo', 'Baboon', 'Badger', 'Barracuda',
            'Bat', 'Bison', 'Bobcat', 'Bonito', 'Buffalo', 'Caiman', 'Camel', 'Caracal',
            'Cheetah', 'Chimpanzee', 'Chipmunk', 'Coati', 'Cobra', 'Condor', 'Cormorant',
            'Coyote', 'Crab', 'Crocodile', 'Deer', 'Dolphin', 'Donkey', 'Dugong',
            'Echidna', 'Elephant', 'Elk', 'Emu', 'Falcon', 'Ferret', 'Flamingo', 'Gazelle',
            'Gecko', 'Gerbil', 'Giraffe', 'Gnu', 'Gopher', 'Gorilla', 'Grizzly', 'Grouper',
            'Guppy', 'Hamster', 'Hare', 'Hedgehog', 'Hyena',
        ];

        return colors[Math.floor(Math.random() * colors.length)] + ' ' + animals[Math.floor(Math.random() * animals.length)];
    }

}()

export default Settings;