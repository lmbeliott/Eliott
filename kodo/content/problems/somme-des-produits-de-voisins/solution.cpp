#include <iostream>
using namespace std;

int main() {
    int n, precedent;
    cin >> n >> precedent;
    int somme = 0;
    // La première valeur est déjà lue : il en reste n - 1.
    for (int i = 0; i < n - 1; i++) {
        int x;
        cin >> x;
        somme = somme + precedent * x;
        precedent = x;
    }
    cout << somme << "\n";
    return 0;
}
