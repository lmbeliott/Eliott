#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    for (int i = 1; i <= n; i++) {
        for (int j = 0; j < n - i; j++) {       // les points de gauche
            cout << ".";
        }
        for (int j = 0; j < 2 * i - 1; j++) {   // les dièses
            cout << "#";
        }
        for (int j = 0; j < n - i; j++) {       // les points de droite
            cout << ".";
        }
        cout << "\n";
    }
    return 0;
}
