#include <iostream>
using namespace std;

int main() {
    // Un bloc de 4 lignes par vague, numérotée de 1 à 12.
    for (int k = 1; k <= 12; k++) {
        cout << "#" << "\n";
        cout << "##" << "\n";
        cout << "###" << " " << k << "\n";
        cout << "##" << "\n";
    }
    // La ligne finale, une seule fois.
    cout << "#" << "\n";
    return 0;
}
