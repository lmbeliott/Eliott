#include <iostream>
#include <string>
using namespace std;

int main() {
    string s;
    cin >> s;
    long long total = 0;
    long long courant = 0;            // valeur du nombre en cours de lecture
    for (char c : s) {
        if (c >= '0' && c <= '9') {
            courant = 10 * courant + (c - '0');
        } else {
            total = total + courant;  // le nombre en cours est terminé
            courant = 0;
        }
    }
    total = total + courant;          // le dernier nombre, si le mot finit par un chiffre
    cout << total << "\n";
    return 0;
}
