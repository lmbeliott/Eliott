#include <iostream>
using namespace std;

int main() {
    int somme = 0;
    int nombre = 0;
    int x;
    cin >> x;
    while (x != 0) {
        somme = somme + x;
        nombre = nombre + 1;
        cin >> x;          // on lit la valeur suivante en dernier
    }
    cout << somme << " " << nombre << "\n";
    return 0;
}
