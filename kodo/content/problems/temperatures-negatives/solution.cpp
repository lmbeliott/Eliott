#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    // Le compteur commence à 0, avant la boucle.
    int negatifs = 0;
    for (int i = 0; i < n; i++) {
        int t;
        cin >> t;
        if (t < 0) {
            negatifs = negatifs + 1;
        }
    }
    cout << negatifs << "\n";
    return 0;
}
