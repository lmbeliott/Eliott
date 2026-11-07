#include <iostream>
using namespace std;

int main() {
    int m, k;
    cin >> m >> k;

    // On compte à partir de 0 : la K-ième personne porte le numéro k - 1.
    int numero = k - 1;

    // Quotient et reste donnent la rangée et la place (comptées à partir de 0),
    // puis on ajoute 1 pour revenir à une numérotation qui commence à 1.
    int rangee = numero / m + 1;
    int place = numero % m + 1;
    cout << rangee << " " << place << "\n";
    return 0;
}
