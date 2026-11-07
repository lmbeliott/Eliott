#include <iostream>
using namespace std;

int main() {
    // Le bloc de deux lignes est répété 10 fois : 20 lignes en tout.
    for (int i = 0; i < 10; i++) {
        cout << "#.#.#.#.#.#.#.#.#.#." << "\n";
        cout << ".#.#.#.#.#.#.#.#.#.#" << "\n";
    }
    return 0;
}
