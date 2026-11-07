#include <iostream>
using namespace std;

int main() {
    int n, precedent;
    cin >> n >> precedent;
    bool monte = false;
    bool descend = false;
    for (int i = 0; i < n - 1; i++) {
        int x;
        cin >> x;
        if (x > precedent) {
            monte = true;
        }
        if (x < precedent) {
            descend = true;
        }
        precedent = x;
    }
    if (!monte && !descend) {
        cout << "CONSTANTE\n";
    } else if (monte && !descend) {
        cout << "CROISSANTE\n";
    } else if (descend && !monte) {
        cout << "DECROISSANTE\n";
    } else {
        cout << "AUCUNE\n";
    }
    return 0;
}
